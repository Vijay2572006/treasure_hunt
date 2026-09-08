# CyberQuest - Gamified Web-Based Digital Treasure Hunt

CyberQuest is a responsive, gamified Web-Based Digital Treasure Hunt application designed for inter-college events with participants from diverse academic departments (CS, Arts, Commerce, Science). Zero programming knowledge is required for players to solve the clues.

---

## 🌟 Key Features

1. **Authentication & Team Management**:
   - **Registration**: Team Name, Leader Name, Department, College, and 4-digit PIN.
   - **Session Restore**: Teams can resume their session using Team Name + PIN.

2. **Sequential 7-Stage Progression**:
   Stage N+1 unlocks **ONLY** upon submitting the correct case-insensitive key for Stage N.
   - **Stage 1 (Audio / Glitch)**: Decrypt reverse/morse audio pulses; integrated audio player with reverse-playback mode and Morse reference legend. (*Key: `ECHOMATRIX`*)
   - **Stage 2 (OSINT / Geolocation)**: High-resolution architectural fragment viewer (Alhambra tilework) with zoom & research hints. (*Key: `ALHAMBRA`*)
   - **Stage 3 (Metadata / File Vault)**: EXIF / Metadata inspector toggle displaying hidden user comments and header parameters. (*Key: `METAVOID`*)
   - **Stage 4 (Rebus / Lateral Thinking)**: Visual emoji equation equation (`🏖️` + `📦`) testing lateral wordplay. (*Key: `SANDBOX`*)
   - **Stage 5 (Inspect / Phantom Link)**: Corrupted 404 terminal UI with CLI commands (`help`, `ls`, `cat secret.txt`) and HTML DOM comment inspector. (*Key: `CIPHERPUNK`*)
   - **Stage 6 (Social Footprint / Case File)**: Mock forum / chat thread with timestamp filters revealing security override commands. (*Key: `OVERRIDE`*)
   - **Stage 7 (The Master Decryption)**: Transposition matrix assembling keys from Stages 1-6 into the final passphrase. (*Key: `SINGULARITY`*)

3. **Hints & Penalty System**:
   - 3 optional hints per team across the entire hunt.
   - Requesting a hint imposes an automatic **+5 minute penalty (+300s)** added to completion time.

4. **Live Leaderboard & Anti-Cheat**:
   - Tracked metrics: Current Stage, Start Time, Completion Time, Hint Penalties, and Final Adjusted Time.
   - Server-side answer validation & right-click prevention on sensitive puzzle assets.
   - Dynamic leaderboard sorting by **Highest Stage Reached**, then **Lowest Adjusted Time**.

---

## 🛠️ Architecture & Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, Web Audio API
- **Backend**: Python 3.12, Django 5.x, Django REST Framework, Django CORS Headers
- **Database**: PostgreSQL (or automatic SQLite fallback for instant local dev)

---

## 📁 Directory Structure

```
d:/treasure/
├── backend/
│   ├── manage.py
│   ├── requirements.txt
│   ├── .env.example
│   ├── db.sqlite3
│   ├── cyberquest/
│   │   ├── __init__.py
│   │   ├── settings.py
│   │   ├── urls.py
│   │   ├── wsgi.py
│   │   └── asgi.py
│   └── hunt/
│       ├── __init__.py
│       ├── apps.py
│       ├── models.py
│       ├── serializers.py
│       ├── views.py
│       ├── urls.py
│       ├── puzzle_data.py
│       ├── admin.py
│       └── tests.py
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── index.html
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── index.css
│       ├── context/
│       │   └── AuthContext.jsx
│       ├── services/
│       │   └── api.js
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── Leaderboard.jsx
│       │   ├── HintModal.jsx
│       │   ├── AuthModal.jsx
│       │   ├── StageNavigation.jsx
│       │   └── AudioPlayer.jsx
│       └── puzzles/
│           ├── Stage1Audio.jsx
│           ├── Stage2Osint.jsx
│           ├── Stage3Metadata.jsx
│           ├── Stage4Rebus.jsx
│           ├── Stage5Inspect.jsx
│           ├── Stage6Social.jsx
│           └── Stage7Master.jsx
└── README.md
```

---

## 🚀 Setup & Installation Instructions

### Prerequisites
- **Python 3.10+** installed
- **Node.js 18+** and `npm` installed
- *(Optional)* **PostgreSQL** installed (defaults to SQLite if not configured)

---

### Step 1: Setting Up the Django Backend

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```

2. (Optional) Create and activate a virtual environment:
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```

3. Install required Python packages:
   ```bash
   pip install -r requirements.txt
   ```

4. Configure Database (PostgreSQL or SQLite):
   - By default, Django uses SQLite (`db.sqlite3`).
   - To connect to **PostgreSQL**, create a `.env` file in `backend/` from `.env.example`:
     ```env
     DB_ENGINE=postgresql
     DB_NAME=cyberquest_db
     DB_USER=postgres
     DB_PASSWORD=your_password
     DB_HOST=localhost
     DB_PORT=5432
     ```

5. Run migrations:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

6. Run backend unit tests:
   ```bash
   python manage.py test
   ```

7. Start the Django development server:
   ```bash
   python manage.py runserver
   ```
   The backend API will be live at `http://127.0.0.1:8000/api/`.

---

### Step 2: Setting Up the React Frontend

1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Install Node dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   The frontend app will open at `http://localhost:5173`.

---

## 🏆 Stage Answers Summary (Admin Reference)

| Stage | Puzzle Type | Solution Passkey |
|-------|------------|------------------|
| **Stage 1** | Audio / Morse Glitch | `ECHOMATRIX` |
| **Stage 2** | OSINT Geolocation | `ALHAMBRA` |
| **Stage 3** | Metadata File Vault | `METAVOID` |
| **Stage 4** | Cryptic Rebus | `SANDBOX` |
| **Stage 5** | HTML Inspector / 404 | `CIPHERPUNK` |
| **Stage 6** | Social Chat / Forum | `OVERRIDE` |
| **Stage 7** | Master Decryption Matrix | `SINGULARITY` |

---

## 🛡️ Anti-Cheat & Security Features

- **Server-Side Validation**: Stage answers are stored on the Django backend only (`puzzle_data.py`) and never exposed to client-side bundles.
- **Strict Linear Locking**: Stage N+1 cannot be retrieved or bypassed without validating Stage N on the server.
- **Anti-Spoiler Protections**: Context menus (`onContextMenu`) are disabled on sensitive puzzle assets to prevent direct file downloads or image inspection.
