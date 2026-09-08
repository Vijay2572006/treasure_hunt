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
            1: "The sound pulses carry a rhythmic pattern of short dots and long dashes. Look for a repeating acoustic sequence.",
            2: "Compare the dot-dash transmission against the Morse Legend table to translate characters E, C, H, O...",
            3: "The first part of the passkey echoes sound waves, and the second part refers to a digital grid system."
        },
        "description": "An encrypted emergency transmission was captured over Sector 7. Locate the audio control inside the question payload, initiate signal playback to generate the frequency pattern, decode the pulse sequence using your Morse Directory, and submit the passkey.",
    },
    2: {
        "title": "Stage 2: OSINT Geolocation Artifact",
        "category": "OSINT / Visual Intelligence",
        "key": "ALHAMBRA",
        "points": 500,
        "hints": {
            1: "Observe the intricate Islamic geometric mosaic tilework and horseshoe arch structure from medieval Spain.",
            2: "Search the GPS coordinates 37.1773° N, 3.5898° W located in Granada, Andalusia.",
            3: "This red-walled fortress palace of the Nasrid Dynasty is one of Spain's most iconic historic landmarks."
        },
        "description": "An encrypted photographic fragment was extracted from a suspect device. Identify the ancient Nasrid Dynasty palace-fortress (whose Arabic name literally translates to 'The Red One', situated on Sabika Hill in Granada, Andalusia at coordinates 37.1773° N, 3.5898° W) to trace the origin.",
    },
    3: {
        "title": "Stage 3: The Metadata Vault",
        "category": "Digital Forensics / File Inspection",
        "key": "METAVOID",
        "points": 500,
        "hints": {
            1: "Surface visual pixels are deceiving. Technical parameters often hide inside non-visual file layers.",
            2: "Inspect embedded EXIF attributes such as XMP UserComment or custom header parameters.",
            3: "Combine the prefix for structural data descriptions with the word for an empty, endless space."
        },
        "description": "A secured document file was recovered from the target server. The visible surface content is blank, but hidden technical parameters reside inside the file metadata layers.",
    },
    4: {
        "title": "Stage 4: Visual Vector Rebus Cipher",
        "category": "Lateral Visual Intelligence & Symbol Cipher",
        "key": "SHADOWNET",
        "points": 500,
        "hints": {
            1: "Analyze the first graphic artifact depicting a dark optical occlusion / solar eclipse silhouette.",
            2: "Analyze the second graphic artifact depicting an interconnected mesh node topology graph.",
            3: "Combine the dark silhouette concept (SHADOW) with the interconnected mesh topology (NET)."
        },
        "description": "The security terminal generated two abstract visual vector artifacts. Deduce the lateral concept of each graphic artifact to form the 9-letter encrypted network term.",
    },
    5: {
        "title": "Stage 5: Steganography & Polybius Cipher Matrix",
        "category": "Visual Steganography & Polybius Grid Cipher",
        "key": "CYBERVAULT",
        "points": 500,
        "hints": {
            1: "Locate the 5x5 dual-pair Polybius grid matrix. Coordinates are formatted as (Row, Column).",
            2: "Map each pair of numbers: (1,2)=C/D, (3,3)=Y/Z, (1,1)=A/B, (1,3)=E/F, (2,4)=Q/R...",
            3: "Disambiguate which character from each dual pair forms a valid 10-letter cybersecurity storage passkey."
        },
        "description": "An encrypted steganographic signal transmission was intercepted. Use the 5x5 dual-letter Polybius grid cipher tool to decode the coordinate stream into the security passkey.",
    },
    6: {
        "title": "Stage 6: Multi-Node Audit Log & Complex Anagram Forensics",
        "category": "Network Log Forensics & Multi-Token Anagram",
        "key": "OBSIDIANVAULT",
        "points": 500,
        "hints": {
            1: "Assemble the 3 fragmented node log tokens: 'I-V-B-L', 'S-A-D-U-I', and 'O-T-A-N'.",
            2: "Combine all 13 letters into a single scrambled bank: I - V - B - L - S - A - D - U - I - O - T - A - N.",
            3: "This 13-letter term combines the dark volcanic rock name (OBSIDIAN) with a secure storage room (VAULT)."
        },
        "description": "An intercepted server audit log contains multi-node scrambled transposition tokens. Analyze the 3 node log streams and unscramble the 13-letter sequence to recover the system key.",
    },
    7: {
        "title": "Stage 7: The Master Decryption Console",
        "category": "Master Passphrase Assembly",
        "key": "SINGULARITY",
        "points": 1000,
        "hints": {
            1: "Your mission progress contains clues. Collect the first character from each of your previous 6 cleared stage keys.",
            2: "Arrange the initial letters (E, A, M, S, C, O) into position and recall the ultimate point of technological evolution.",
            3: "This scientific term describes the theoretical point in time when artificial intelligence surpasses human control."
        },
        "description": "The final central firewall terminal requires the master passphrase. Combine all stage keys unlocked during your mission into the master decryption matrix.",
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
