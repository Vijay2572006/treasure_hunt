from django.contrib import admin
from .models import Team, HintLog, SubmissionLog

@admin.register(Team)
class TeamAdmin(admin.ModelAdmin):
    list_display = ('team_name', 'college', 'member1_name', 'member1_mobile', 'member2_name', 'member2_mobile', 'current_stage', 'hint_count', 'formatted_adjusted_time')
    search_fields = ('team_name', 'college', 'member1_name', 'member1_email', 'member2_name', 'member2_email')
    list_filter = ('current_stage', 'college')

@admin.register(HintLog)
class HintLogAdmin(admin.ModelAdmin):
    list_display = ('team', 'stage', 'requested_at', 'penalty_seconds')

@admin.register(SubmissionLog)
class SubmissionLogAdmin(admin.ModelAdmin):
    list_display = ('team', 'stage', 'submitted_key', 'is_correct', 'submitted_at')
    list_filter = ('is_correct', 'stage')
