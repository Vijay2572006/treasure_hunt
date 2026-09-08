from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from .models import Team, HintLog, SubmissionLog

class CyberQuestBackendTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.register_data = {
            "team_name": "CyberKnights",
            "college": "NIFT-TEA College of Knitwear Fashion",
            "member1_name": "Alice Turing",
            "member1_mobile": "9876543210",
            "member1_email": "alice@nifttea.ac.in",
            "member2_name": "Bob Lovelace",
            "member2_mobile": "9876543211",
            "member2_email": "bob@nifttea.ac.in",
            "pin": "1234"
        }

    def test_team_registration_and_login(self):
        # Register
        res = self.client.post('/api/register/', self.register_data, format='json')
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertIn('token', res.data)
        token = res.data['token']

        # Session Restore / Login
        login_res = self.client.post('/api/login/', {
            "team_name": "CyberKnights",
            "pin": "1234"
        }, format='json')
        self.assertEqual(login_res.status_code, status.HTTP_200_OK)
        self.assertEqual(login_res.data['token'], token)

    def test_sequential_stage_progression(self):
        reg_res = self.client.post('/api/register/', self.register_data, format='json')
        token = reg_res.data['token']

        keys = ["ECHOMATRIX", "ALHAMBRA", "METAVOID", "SHADOWNET", "CYBERVAULT", "OBSIDIANVAULT", "SINGULARITY"]
        for idx, key in enumerate(keys, start=1):
            sub = self.client.post('/api/submit/', {'key': key}, HTTP_AUTHORIZATION=f'Bearer {token}', format='json')
            self.assertTrue(sub.data['correct'])
