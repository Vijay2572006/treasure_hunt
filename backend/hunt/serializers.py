from rest_framework import serializers
from .models import Team, HintLog, SubmissionLog

class TeamRegisterSerializer(serializers.Serializer):
    team_name = serializers.CharField(max_length=100)
    college = serializers.CharField(max_length=200)

    # Member 1
    member1_name = serializers.CharField(max_length=100)
    member1_mobile = serializers.CharField(max_length=15)
    member1_email = serializers.EmailField()

    # Member 2
    member2_name = serializers.CharField(max_length=100)
    member2_mobile = serializers.CharField(max_length=15)
    member2_email = serializers.EmailField()

    pin = serializers.CharField(min_length=4, max_length=4)

    def validate_pin(self, value):
        if not value.isdigit():
            raise serializers.ValidationError("PIN must be a 4-digit numeric code.")
        return value

    def validate_team_name(self, value):
        if Team.objects.filter(team_name__iexact=value.strip()).exists():
            raise serializers.ValidationError("Team Name is already registered. Please choose another or restore session.")
        return value.strip()


class TeamLoginSerializer(serializers.Serializer):
    team_name = serializers.CharField(max_length=100)
    pin = serializers.CharField(min_length=4, max_length=4)


class TeamProfileSerializer(serializers.ModelSerializer):
    is_completed = serializers.BooleanField(read_only=True)
    adjusted_time_seconds = serializers.IntegerField(read_only=True)
    formatted_adjusted_time = serializers.CharField(read_only=True)

    class Meta:
        model = Team
        fields = [
            'id', 'team_name', 'college',
            'member1_name', 'member1_mobile', 'member1_email',
            'member2_name', 'member2_mobile', 'member2_email',
            'current_stage', 'start_time', 'stage_start_time', 'end_time',
            'hint_count', 'penalty_seconds', 'total_score', 'token',
            'is_completed', 'adjusted_time_seconds', 'formatted_adjusted_time'
        ]


class LeaderboardSerializer(serializers.ModelSerializer):
    adjusted_time_seconds = serializers.IntegerField(read_only=True)
    formatted_adjusted_time = serializers.CharField(read_only=True)
    is_completed = serializers.BooleanField(read_only=True)

    class Meta:
        model = Team
        fields = [
            'id', 'team_name', 'college',
            'member1_name', 'member2_name',
            'current_stage', 'hint_count', 'penalty_seconds', 'total_score',
            'adjusted_time_seconds', 'formatted_adjusted_time', 'is_completed'
        ]


class SubmitKeySerializer(serializers.Serializer):
    key = serializers.CharField(max_length=100)


class RequestHintSerializer(serializers.Serializer):
    hint_index = serializers.IntegerField(min_value=1, max_value=3)
