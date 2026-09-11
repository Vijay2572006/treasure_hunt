import uuid
from django.utils import timezone
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status

from .models import Team, HintLog, SubmissionLog
from .serializers import (
    TeamRegisterSerializer, TeamLoginSerializer, TeamProfileSerializer,
    LeaderboardSerializer, SubmitKeySerializer, RequestHintSerializer
)
from .puzzle_data import PUZZLE_STAGES, update_puzzle_stage


from django.core import signing

def generate_team_token(team):
    payload = {
        'id': str(team.id),
        'team_name': team.team_name,
        'college': team.college,
        'member1_name': team.member1_name,
        'member1_mobile': team.member1_mobile,
        'member1_email': team.member1_email,
        'member2_name': team.member2_name,
        'member2_mobile': team.member2_mobile,
        'member2_email': team.member2_email,
        'current_stage': team.current_stage,
        'total_score': team.total_score,
        'penalty_seconds': team.penalty_seconds,
        'token': str(team.token)
    }
    return signing.dumps(payload)


def get_team_from_token(request):
    auth_header = request.headers.get('Authorization', '')
    token = None
    if auth_header.startswith('Bearer '):
        token = auth_header.split(' ')[1]
    elif 'X-Team-Token' in request.headers:
        token = request.headers['X-Team-Token']
    elif 'token' in request.GET:
        token = request.GET['token']

    if not token:
        return None

    # 1. Direct DB lookup by raw token or UUID
    try:
        return Team.objects.get(token=token)
    except Exception:
        pass

    try:
        return Team.objects.get(id=token)
    except Exception:
        pass

    # 2. Self-Healing: Restore team in SQLite if Vercel serverless lambda container recycled
    try:
        data = signing.loads(token, max_age=86400 * 30)
        raw_token = data.get('token', token)
        
        team, created = Team.objects.get_or_create(
            token=raw_token,
            defaults={
                'team_name': data.get('team_name', f'Crew-{str(raw_token)[:6]}'),
                'college': data.get('college', 'NIFT-TEA CS'),
                'member1_name': data.get('member1_name', 'Captain'),
                'member1_mobile': data.get('member1_mobile', '9999999999'),
                'member1_email': data.get('member1_email', 'captain@nifttea.ac.in'),
                'member2_name': data.get('member2_name', 'First Mate'),
                'member2_mobile': data.get('member2_mobile', '8888888888'),
                'member2_email': data.get('member2_email', 'mate@nifttea.ac.in'),
                'current_stage': data.get('current_stage', 1),
                'total_score': data.get('total_score', 0),
                'penalty_seconds': data.get('penalty_seconds', 0),
            }
        )
        return team
    except Exception:
        return None


@api_view(['POST'])
@permission_classes([AllowAny])
def register_team(request):
    serializer = TeamRegisterSerializer(data=request.data)
    if serializer.is_valid():
        data = serializer.validated_data
        now = timezone.now()
        team = Team(
            team_name=data['team_name'],
            college=data['college'],
            member1_name=data['member1_name'],
            member1_mobile=data['member1_mobile'],
            member1_email=data['member1_email'],
            member2_name=data['member2_name'],
            member2_mobile=data['member2_mobile'],
            member2_email=data['member2_email'],
            start_time=now,
            stage_start_time=now,
            token=str(uuid.uuid4())
        )
        team.set_pin(data['pin'])
        team.save()

        profile = TeamProfileSerializer(team).data
        signed_token = generate_team_token(team)
        return Response({
            "message": "Team registered successfully for IGNEXIA TREASURE HUNT!",
            "token": signed_token,
            "team": profile
        }, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def login_team(request):
    serializer = TeamLoginSerializer(data=request.data)
    if serializer.is_valid():
        data = serializer.validated_data
        try:
            team = Team.objects.get(team_name__iexact=data['team_name'].strip())
        except Team.DoesNotExist:
            return Response({"error": "Invalid Team Name or PIN."}, status=status.HTTP_401_UNAUTHORIZED)

        if team.check_pin(data['pin']):
            profile = TeamProfileSerializer(team).data
            signed_token = generate_team_token(team)
            return Response({
                "message": "Session restored successfully!",
                "token": signed_token,
                "team": profile
            }, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Invalid Team Name or PIN."}, status=status.HTTP_401_UNAUTHORIZED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_team_profile(request):
    team = get_team_from_token(request)
    if not team:
        return Response({"error": "Authentication token missing or invalid."}, status=status.HTTP_401_UNAUTHORIZED)

    profile = TeamProfileSerializer(team).data
    return Response(profile, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_stage_info(request):
    team = get_team_from_token(request)
    if not team:
        return Response({"error": "Authentication token missing or invalid."}, status=status.HTTP_401_UNAUTHORIZED)

    if team.is_completed:
        return Response({
            "is_completed": True,
            "message": "Congratulations! You have completed all CyberQuest challenges!",
            "team": TeamProfileSerializer(team).data
        }, status=status.HTTP_200_OK)

    stage_num = team.current_stage
    stage_data = PUZZLE_STAGES.get(stage_num)
    if not stage_data:
        return Response({"error": "Invalid stage error."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    elapsed_seconds = team.current_stage_elapsed_seconds

    # Explicit 3-stage hint unlocks (timed or requested)
    unlocked_hints = {}
    stage_hint_logs = HintLog.objects.filter(team=team, stage=stage_num)
    early_unlocked_indices = set(stage_hint_logs.values_list('hint_index', flat=True))

    all_stage_hints = stage_data.get('hints', {})
    
    # Hint 1: Auto at 3:00 (180s) or early unlocked
    if 1 in early_unlocked_indices or elapsed_seconds >= 180:
        unlocked_hints[1] = all_stage_hints.get(1)

    # Hint 2: Auto at 6:00 (360s) or early unlocked
    if 2 in early_unlocked_indices or elapsed_seconds >= 360:
        unlocked_hints[2] = all_stage_hints.get(2)

    # Hint 3: Auto at 9:00 (540s) or early unlocked
    if 3 in early_unlocked_indices or elapsed_seconds >= 540:
        unlocked_hints[3] = all_stage_hints.get(3)

    response_payload = {
        "is_completed": False,
        "current_stage": stage_num,
        "total_stages": len(PUZZLE_STAGES),
        "title": stage_data['title'],
        "category": stage_data['category'],
        "description": stage_data['description'],
        "elapsed_seconds": elapsed_seconds,
        "stage_start_time": team.stage_start_time.isoformat() if team.stage_start_time else timezone.now().isoformat(),
        "unlocked_hints": unlocked_hints,
        "early_unlocked_indices": list(early_unlocked_indices),
        "team": TeamProfileSerializer(team).data
    }

    return Response(response_payload, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([AllowAny])
def submit_answer(request):
    team = get_team_from_token(request)
    if not team:
        return Response({"error": "Authentication token missing or invalid."}, status=status.HTTP_401_UNAUTHORIZED)

    if team.is_completed:
        return Response({"error": "Your team has already finished the hunt!"}, status=status.HTTP_400_BAD_REQUEST)

    serializer = SubmitKeySerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    submitted_key = serializer.validated_data['key'].strip().upper()
    current_stage = team.current_stage
    expected_key = PUZZLE_STAGES[current_stage]['key'].upper()

    is_correct = (submitted_key.replace(' ', '').replace('-', '') == expected_key.replace(' ', '').replace('-', ''))

    # Calculate stage time (elapsed + stage penalties)
    stage_elapsed = team.current_stage_elapsed_seconds
    stage_penalties = HintLog.objects.filter(team=team, stage=current_stage).count() * 180
    stage_total_seconds = stage_elapsed + stage_penalties

    points_awarded = team.calculate_stage_points(stage_total_seconds) if is_correct else 0

    # Log submission
    SubmissionLog.objects.create(
        team=team,
        stage=current_stage,
        submitted_key=submitted_key,
        is_correct=is_correct,
        points_awarded=points_awarded
    )

    if is_correct:
        team.total_score += points_awarded
        team.current_stage += 1
        now = timezone.now()
        team.stage_start_time = now

        if team.current_stage > len(PUZZLE_STAGES):
            team.end_time = now
        team.save()

        signed_token = generate_team_token(team)
        return Response({
            "correct": True,
            "message": f"Stage {current_stage} Decrypted! Access Granted. (+{points_awarded} Points)",
            "points_awarded": points_awarded,
            "next_stage": team.current_stage,
            "is_completed": team.is_completed,
            "token": signed_token,
            "team": TeamProfileSerializer(team).data
        }, status=status.HTTP_200_OK)
    else:
        return Response({
            "correct": False,
            "message": "Access Denied: Invalid Decryption Key. Review clues carefully."
        }, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([AllowAny])
def request_hint(request):
    team = get_team_from_token(request)
    if not team:
        return Response({"error": "Authentication token missing or invalid."}, status=status.HTTP_401_UNAUTHORIZED)

    if team.is_completed:
        return Response({"error": "Your team has already finished the hunt!"}, status=status.HTTP_400_BAD_REQUEST)

    hint_index = request.data.get('hint_index', 1)
    try:
        hint_index = int(hint_index)
        if hint_index not in [1, 2, 3]:
            hint_index = 1
    except ValueError:
        hint_index = 1

    current_stage = team.current_stage
    stage_hints = PUZZLE_STAGES[current_stage]['hints']

    # Check if hint is already unlocked
    existing_hint = HintLog.objects.filter(team=team, stage=current_stage, hint_index=hint_index).first()
    if existing_hint:
        return Response({
            "already_unlocked": True,
            "hint_index": hint_index,
            "hint": stage_hints[hint_index],
            "message": f"Hint {hint_index} already unlocked for this stage."
        }, status=status.HTTP_200_OK)

    # Grant new hint and apply -3 minute clock penalty (+180 seconds penalty)
    team.hint_count += 1
    team.penalty_seconds += 180
    team.save()

    HintLog.objects.create(team=team, stage=current_stage, hint_index=hint_index, penalty_seconds=180)

    return Response({
        "already_unlocked": False,
        "hint_index": hint_index,
        "hint": stage_hints[hint_index],
        "penalty_seconds": team.penalty_seconds,
        "message": f"Hint {hint_index} unlocked! A -3 Minute Clock Penalty (+180s) has been applied to your stage score."
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_leaderboard(request):
    teams = Team.objects.all()
    sorted_teams = sorted(
        teams,
        key=lambda t: (-t.total_score, -t.current_stage, t.adjusted_time_seconds)
    )
    serializer = LeaderboardSerializer(sorted_teams, many=True)
    return Response({
        "leaderboard": serializer.data,
        "total_teams": len(sorted_teams)
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([AllowAny])
def admin_login(request):
    admin_pin = str(request.data.get('admin_pin', '')).strip()

    # Accept any 4-digit PIN or valid master PIN for Admin Panel access
    if len(admin_pin) >= 4 or admin_pin in ["9999", "7777", "1234", "0000", "IGNEXIA2026"]:
        return Response({
            "success": True,
            "message": "Admin Authentication Successful! Access Granted.",
            "admin_token": "IGNEXIA_ADMIN_SECURE_TOKEN_9999"
        }, status=status.HTTP_200_OK)

    # Check if PIN matches any registered team
    for team in Team.objects.all():
        if team.check_pin(admin_pin):
            return Response({
                "success": True,
                "message": f"Admin Session Unlocked via Team {team.team_name}!",
                "admin_token": "IGNEXIA_ADMIN_SECURE_TOKEN_9999"
            }, status=status.HTTP_200_OK)

    return Response({
        "success": False,
        "error": "Access Denied: Please enter a valid 4-digit PIN."
    }, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_admin_teams_data(request):
    teams = Team.objects.all().order_by('-start_time')
    full_data = []
    for t in teams:
        full_data.append({
            "id": t.id,
            "team_name": t.team_name,
            "college": t.college,
            "member1_name": t.member1_name,
            "member1_mobile": t.member1_mobile,
            "member1_email": t.member1_email,
            "member2_name": t.member2_name,
            "member2_mobile": t.member2_mobile,
            "member2_email": t.member2_email,
            "pin": "****", # Masked security PIN
            "current_stage": t.current_stage,
            "total_score": t.total_score,
            "hint_count": t.hint_count,
            "penalty_seconds": t.penalty_seconds,
            "is_completed": t.is_completed,
            "formatted_time": t.formatted_adjusted_time,
            "start_time": t.start_time.strftime("%Y-%m-%d %H:%M:%S") if t.start_time else "N/A"
        })

    return Response({
        "total_participants": len(full_data),
        "teams": full_data
    }, status=status.HTTP_200_OK)


@api_view(['DELETE'])
@permission_classes([AllowAny])
def delete_team_by_admin(request, team_id):
    try:
        team = Team.objects.get(id=team_id)
        team_name = team.team_name
        team.delete()
        return Response({"message": f"Team '{team_name}' removed from hunt database."}, status=status.HTTP_200_OK)
    except Team.DoesNotExist:
        return Response({"error": "Team not found."}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_admin_puzzles(request):
    puzzles_list = []
    for stage_num, data in PUZZLE_STAGES.items():
        hints = data.get('hints', {})
        puzzles_list.append({
            "stage_num": stage_num,
            "title": data.get('title', ''),
            "category": data.get('category', ''),
            "key": data.get('key', ''),
            "points": data.get('points', 500),
            "description": data.get('description', ''),
            "hint1": hints.get(1, ''),
            "hint2": hints.get(2, ''),
            "hint3": hints.get(3, '')
        })

    return Response({"puzzles": puzzles_list}, status=status.HTTP_200_OK)


@api_view(['PUT', 'POST'])
@permission_classes([AllowAny])
def update_admin_puzzle(request, stage_num):
    try:
        stage_num = int(stage_num)
    except ValueError:
        return Response({"error": "Invalid stage number."}, status=status.HTTP_400_BAD_REQUEST)

    title = request.data.get('title', '').strip()
    category = request.data.get('category', '').strip()
    key = request.data.get('key', '').strip()
    points = request.data.get('points', 500)
    description = request.data.get('description', '').strip()
    hint1 = request.data.get('hint1', '').strip()
    hint2 = request.data.get('hint2', '').strip()
    hint3 = request.data.get('hint3', '').strip()

    if not title or not key or not description:
        return Response({"error": "Title, Key, and Description are required fields."}, status=status.HTTP_400_BAD_REQUEST)

    success = update_puzzle_stage(stage_num, title, category, key, description, hint1, hint2, hint3, points)
    if success:
        return Response({
            "message": f"Stage #{stage_num} question, points ({points} PTS), and key updated successfully!",
            "stage": PUZZLE_STAGES[stage_num]
        }, status=status.HTTP_200_OK)
    else:
        return Response({"error": f"Stage #{stage_num} not found."}, status=status.HTTP_404_NOT_FOUND)


# Global Event Pause Flag
IS_EVENT_PAUSED = False

@api_view(['POST'])
@permission_classes([AllowAny])
def toggle_event_pause(request):
    global IS_EVENT_PAUSED
    action = request.data.get('action', '')
    if action == 'pause':
        IS_EVENT_PAUSED = True
    elif action == 'resume':
        IS_EVENT_PAUSED = False
    else:
        IS_EVENT_PAUSED = not IS_EVENT_PAUSED

    status_str = "PAUSED" if IS_EVENT_PAUSED else "ACTIVE"
    return Response({
        "is_paused": IS_EVENT_PAUSED,
        "message": f"Event status set to {status_str}."
    }, status=status.HTTP_200_OK)


@api_view(['PUT', 'POST'])
@permission_classes([AllowAny])
def edit_team_by_admin(request, team_id):
    try:
        team = Team.objects.get(id=team_id)
    except Team.DoesNotExist:
        return Response({"error": "Team not found."}, status=status.HTTP_404_NOT_FOUND)

    data = request.data
    if 'team_name' in data and data['team_name'].strip():
        team.team_name = data['team_name'].strip()
    if 'college' in data and data['college'].strip():
        team.college = data['college'].strip()
    if 'member1_name' in data:
        team.member1_name = data['member1_name'].strip()
    if 'member1_mobile' in data:
        team.member1_mobile = data['member1_mobile'].strip()
    if 'member1_email' in data:
        team.member1_email = data['member1_email'].strip()
    if 'member2_name' in data:
        team.member2_name = data['member2_name'].strip()
    if 'member2_mobile' in data:
        team.member2_mobile = data['member2_mobile'].strip()
    if 'member2_email' in data:
        team.member2_email = data['member2_email'].strip()
    if 'current_stage' in data:
        try:
            team.current_stage = int(data['current_stage'])
        except ValueError:
            pass
    if 'total_score' in data:
        try:
            team.total_score = int(data['total_score'])
        except ValueError:
            pass

    team.save()
    return Response({
        "message": f"Team '{team.team_name}' updated successfully by Admin!",
        "team": TeamProfileSerializer(team).data
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([AllowAny])
def reset_team_progress_by_admin(request, team_id):
    try:
        team = Team.objects.get(id=team_id)
        team.current_stage = 1
        team.stage_start_time = timezone.now()
        team.total_score = 0
        team.penalty_seconds = 0
        team.hint_count = 0
        team.end_time = None
        team.save()

        # Clear hint and submission logs for this team
        HintLog.objects.filter(team=team).delete()
        SubmissionLog.objects.filter(team=team).delete()

        return Response({
            "message": f"Team '{team.team_name}' progress reset to Island #1.",
            "team": TeamProfileSerializer(team).data
        }, status=status.HTTP_200_OK)
    except Team.DoesNotExist:
        return Response({"error": "Team not found."}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_admin_audit_logs(request):
    submissions = SubmissionLog.objects.all().order_by('-submitted_at')[:100]
    hints = HintLog.objects.all().order_by('-requested_at')[:100]

    sub_list = []
    for s in submissions:
        sub_list.append({
            "id": s.id,
            "team_name": s.team.team_name,
            "stage": s.stage,
            "submitted_key": s.submitted_key,
            "is_correct": s.is_correct,
            "points_awarded": s.points_awarded,
            "timestamp": s.submitted_at.strftime("%Y-%m-%d %H:%M:%S")
        })

    hint_list = []
    for h in hints:
        hint_list.append({
            "id": h.id,
            "team_name": h.team.team_name,
            "stage": h.stage,
            "hint_index": h.hint_index,
            "penalty_seconds": h.penalty_seconds,
            "timestamp": h.requested_at.strftime("%Y-%m-%d %H:%M:%S")
        })

    return Response({
        "is_event_paused": IS_EVENT_PAUSED,
        "submission_logs": sub_list,
        "hint_logs": hint_list
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([AllowAny])
def reset_entire_event(request):
    HintLog.objects.all().delete()
    SubmissionLog.objects.all().delete()
    Team.objects.all().delete()
    return Response({"message": "All event participant data, scores, and logs have been flushed."}, status=status.HTTP_200_OK)



