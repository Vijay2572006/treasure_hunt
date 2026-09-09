"""
Puzzle Data configuration for IGNEXIA TREASURE HUNT
Sanitized keys, stage points, and 3 indirect hints per stage.
"""

PUZZLE_STAGES = {
    1: {
        "title": "Stage 1: The Acoustic Cipher Protocol",
        "category": "Audio Signal Decryption & Morse Forensics",
        "key": "ECHOMATRIX",
        "points": 500,
        "hints": {
            1: "Press PLAY on the audio player to listen to the rhythmic pattern of short dots (.) and long dashes (-).",
            2: "Use the Morse Legend table to translate each acoustic pulse sequence: . (E), -.-. (C), .... (H), --- (O)...",
            3: "Combine the word for sound reflections ('ECHO') with a digital grid system ('MATRIX') to form ECHOMATRIX."
        },
        "description": "An encrypted audio transmission was captured. Initiate signal playback to listen to the Morse code pulse pattern, use the provided Morse Legend table to translate the dots and dashes, and submit the 10-letter passkey.",
    },
    2: {
        "title": "Stage 2: OSINT Geolocation Artifact",
        "category": "OSINT / Visual Intelligence",
        "key": "ALHAMBRA",
        "points": 500,
        "hints": {
            1: "Examine the historic photo fragment showing Islamic geometric tilework and horseshoe arches from medieval Spain.",
            2: "Search the provided GPS coordinates (37.1773° N, 3.5898° W) located on Sabika Hill in Granada, Andalusia.",
            3: "Identify the famous Nasrid Dynasty red fortress palace (whose Arabic name means 'The Red One'): ALHAMBRA."
        },
        "description": "An encrypted photographic fragment was extracted from a suspect device. Identify the famous Nasrid Dynasty palace-fortress in Granada, Spain located at GPS coordinates 37.1773° N, 3.5898° W to submit its iconic 8-letter name.",
    },
    3: {
        "title": "Stage 3: The Metadata Vault",
        "category": "Digital Forensics / File Inspection",
        "key": "METAVOID",
        "points": 500,
        "hints": {
            1: "Visual surface pixels are blank. Click the 'INSPECT METADATA' button to view hidden file parameters.",
            2: "Look inside the embedded EXIF header fields for the hidden UserComment tag value.",
            3: "Combine the prefix for file information ('META') with the word for an empty space ('VOID') to form METAVOID."
        },
        "description": "A secured document file was recovered from the target server. The visual document area is blank, but hidden parameters reside inside the file header. Toggle the Metadata Inspector to reveal the 8-letter security passkey.",
    },
    4: {
        "title": "Stage 4: Visual Vector Rebus Cipher",
        "category": "Lateral Visual Intelligence & Symbol Cipher",
        "key": "SHADOWNET",
        "points": 500,
        "hints": {
            1: "Analyze Artifact 1: A dark silhouette and solar eclipse representing a SHADOW.",
            2: "Analyze Artifact 2: A woven grid mesh representing a physical NET.",
            3: "Join Artifact 1 + Artifact 2 together (SHADOW + NET) to form the 9-letter passkey SHADOWNET."
        },
        "description": "Two visual vector artifacts are displayed: Artifact 1 depicts a dark silhouette eclipse (SHADOW), and Artifact 2 depicts a woven mesh grid (NET). Deduce both concepts and join them to form the 9-letter network passkey.",
    },
    5: {
        "title": "Stage 5: Steganography & Polybius Cipher Matrix",
        "category": "Visual Steganography & Polybius Grid Cipher",
        "key": "CYBERVAULT",
        "points": 500,
        "hints": {
            1: "An intercepted signal gave 10 coordinate pairs: (1,2) (3,3) (1,1) (1,3) (2,4) (3,1) (1,1) (3,1) (2,1) (2,5).",
            2: "Locate each coordinate on the 5x5 Polybius Grid where the first number is the Row and the second is the Column.",
            3: "Map the coordinate letters (C/D -> C, Y/Z -> Y, A/B -> B, E/F -> E...) to spell the 10-letter passkey CYBERVAULT."
        },
        "description": "An encrypted coordinate transmission was intercepted: (1,2) (3,3) (1,1) (1,3) (2,4) (3,1) (1,1) (3,1) (2,1) (2,5). Use the 5x5 Polybius grid matrix to map each (Row, Column) pair into letters and submit the 10-letter cybersecurity passkey.",
    },
    6: {
        "title": "Stage 6: Event Cipher & Anagram Forensics",
        "category": "Event Identity & Anagram Cipher",
        "key": "IGNEXIA",
        "points": 500,
        "hints": {
            1: "Collect all 7 scrambled letters from the 3 audit log node streams: A, E, G, I, I, N, X.",
            2: "This 7-letter term is the official title of this inter-college digital treasure hunt event.",
            3: "Unscramble the 7 letters to spell the event passkey: IGNEXIA."
        },
        "description": "An intercepted server audit log contains 3 node log streams with scrambled letter tokens: [G-I], [N-E-X], and [I-A]. Unscramble all 7 letters to recover the grand inter-college digital treasure hunt event title.",
    },
    7: {
        "title": "Stage 7: The Master Decryption Console",
        "category": "Master Passphrase Assembly",
        "key": "SINGULARITY",
        "points": 1000,
        "hints": {
            1: "Move your cursor inside the dark chamber to beam your flashlight and reveal the 11 hidden golden letters: S, I, N, G, U, L, A, R, I, T, Y.",
            2: "Arrange the 11 letters (or combine the initial letters E, A, M, S, C, I from cleared stages 1-6) into position.",
            3: "This 11-letter scientific term describes the point in time when technological growth and artificial intelligence become uncontrollable and irreversible: SINGULARITY."
        },
        "description": "The final Treasure Point is engulfed in pitch darkness. Sweep your flashlight beam across the dark chamber to discover 11 hidden glowing letters, and unscramble them to reveal the 11-letter scientific term for the ultimate point of technological evolution.",
    }
}


def update_puzzle_stage(stage_num, title, category, key, description, hint1, hint2, hint3, points=500):
    if stage_num in PUZZLE_STAGES:
        PUZZLE_STAGES[stage_num]['title'] = title
        PUZZLE_STAGES[stage_num]['category'] = category
        PUZZLE_STAGES[stage_num]['key'] = key.strip().upper()
        PUZZLE_STAGES[stage_num]['description'] = description
        try:
            PUZZLE_STAGES[stage_num]['points'] = int(points)
        except (ValueError, TypeError):
            PUZZLE_STAGES[stage_num]['points'] = 500

        if 'hints' not in PUZZLE_STAGES[stage_num]:
            PUZZLE_STAGES[stage_num]['hints'] = {}
        PUZZLE_STAGES[stage_num]['hints'][1] = hint1
        PUZZLE_STAGES[stage_num]['hints'][2] = hint2
        PUZZLE_STAGES[stage_num]['hints'][3] = hint3
        return True
    return False
