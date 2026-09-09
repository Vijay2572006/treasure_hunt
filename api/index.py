import os
import sys

# Add backend directory to sys.path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend'))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'cyberquest.settings')

from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()

# Run database migrations on startup to create hunt_team and all tables on Vercel
try:
    from django.core.management import call_command
    call_command('migrate', interactive=False)
except Exception as e:
    print(f"Auto-migration error on Vercel: {e}")

app = application
