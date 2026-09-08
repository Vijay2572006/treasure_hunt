from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register_team, name='register_team'),
    path('login/', views.login_team, name='login_team'),
    path('profile/', views.get_team_profile, name='team_profile'),
    path('stage/', views.get_stage_info, name='stage_info'),
    path('submit/', views.submit_answer, name='submit_answer'),
    path('request-hint/', views.request_hint, name='request_hint'),
    path('leaderboard/', views.get_leaderboard, name='leaderboard'),
    path('admin/login/', views.admin_login, name='admin_login'),
    path('admin/teams/', views.get_admin_teams_data, name='admin_teams'),
    path('admin/teams/<uuid:team_id>/edit/', views.edit_team_by_admin, name='admin_edit_team'),
    path('admin/teams/<uuid:team_id>/reset/', views.reset_team_progress_by_admin, name='admin_reset_team'),
    path('admin/teams/<uuid:team_id>/', views.delete_team_by_admin, name='admin_delete_team'),
    path('admin/puzzles/', views.get_admin_puzzles, name='admin_puzzles'),
    path('admin/puzzles/<int:stage_num>/', views.update_admin_puzzle, name='admin_update_puzzle'),
    path('admin/logs/', views.get_admin_audit_logs, name='admin_logs'),
    path('admin/event/toggle-pause/', views.toggle_event_pause, name='admin_toggle_pause'),
    path('admin/event/reset-all/', views.reset_entire_event, name='admin_reset_all'),
]
