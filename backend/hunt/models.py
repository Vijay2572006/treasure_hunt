import uuid
from django.db import models
from django.utils import timezone
from django.contrib.auth.hashers import make_password, check_password

class Team(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    team_name = models.CharField(max_length=100, unique=True)
    college = models.CharField(max_length=200)

    # Member 1 (Leader) Details
    member1_name = models.CharField(max_length=100)
    member1_mobile = models.CharField(max_length=15)
    member1_email = models.EmailField(max_length=150)

    # Member 2 Details
    member2_name = models.CharField(max_length=100)
    member2_mobile = models.CharField(max_length=15)
    member2_email = models.EmailField(max_length=150)

    pin_hash = models.CharField(max_length=128)
    
    current_stage = models.IntegerField(default=1)  # 1 to 7; 8 = Completed
    start_time = models.DateTimeField(default=timezone.now)
    stage_start_time = models.DateTimeField(default=timezone.now)
    end_time = models.DateTimeField(null=True, blank=True)
    
    hint_count = models.IntegerField(default=0)
    penalty_seconds = models.IntegerField(default=0)  # +180s per hint (-3 min clock penalty)
    total_score = models.IntegerField(default=0)       # Points accumulated across stages
    
    token = models.CharField(max_length=64, unique=True, default=uuid.uuid4)
    created_at = models.DateTimeField(auto_now_add=True)

    def set_pin(self, raw_pin):
        self.pin_hash = make_password(str(raw_pin))

    def check_pin(self, raw_pin):
        return check_password(str(raw_pin), self.pin_hash)

    @property
    def is_completed(self):
        return self.current_stage > 7

    @property
    def current_stage_elapsed_seconds(self):
        elapsed = (timezone.now() - self.stage_start_time).total_seconds()
        return max(0, int(elapsed))

    @property
    def total_elapsed_seconds(self):
        end = self.end_time if self.end_time else timezone.now()
        elapsed = (end - self.start_time).total_seconds()
        return max(0, int(elapsed))

    @property
    def adjusted_time_seconds(self):
        return self.total_elapsed_seconds + self.penalty_seconds

    def calculate_stage_points(self, stage_seconds):
        """
        Exact Time-Based Point System (Max 5 Points per Stage, 10-Min Timer):
        0:00 – 3:00 min (0-180s)   => 5 Points
        3:01 – 5:00 min (181-300s) => 4 Points
        5:01 – 7:00 min (301-420s) => 3 Points
        7:01 – 8:00 min (421-480s) => 2 Points
        8:01 – 9:00 min (481-540s) => 1 Point
        > 10:00 min / Expired (>600s) => 0 Points
        """
        if stage_seconds <= 180:
            return 5
        elif stage_seconds <= 300:
            return 4
        elif stage_seconds <= 420:
            return 3
        elif stage_seconds <= 480:
            return 2
        elif stage_seconds <= 540:
            return 1
        return 0

    def formatted_adjusted_time(self):
        total_sec = self.adjusted_time_seconds
        hours = total_sec // 3600
        minutes = (total_sec % 3600) // 60
        seconds = total_sec % 60
        if hours > 0:
            return f"{hours:02d}h {minutes:02d}m {seconds:02d}s"
        return f"{minutes:02d}m {seconds:02d}s"

    def __str__(self):
        return f"{self.team_name} ({self.college}) - Stage {self.current_stage}"


class HintLog(models.Model):
    team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name='hint_logs')
    stage = models.IntegerField()
    hint_index = models.IntegerField(default=1)  # 1, 2, or 3
    requested_at = models.DateTimeField(auto_now_add=True)
    penalty_seconds = models.IntegerField(default=180)  # -3 min penalty

    def __str__(self):
        return f"Hint {self.hint_index} for {self.team.team_name} at Stage {self.stage}"


class SubmissionLog(models.Model):
    team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name='submission_logs')
    stage = models.IntegerField()
    submitted_key = models.CharField(max_length=100)
    is_correct = models.BooleanField(default=False)
    submitted_at = models.DateTimeField(auto_now_add=True)
    points_awarded = models.IntegerField(default=0)

    def __str__(self):
        status = "CORRECT" if self.is_correct else "WRONG"
        return f"{self.team.team_name} - Stage {self.stage}: {self.submitted_key} [{status}]"
