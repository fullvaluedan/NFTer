"""Configuration settings for the NFTer backend."""

import os
from pathlib import Path
from typing import List, Tuple, TypedDict

# Base directory
BASE_DIR = Path(__file__).resolve().parent.parent.parent

# Upload settings
UPLOAD_FOLDER = BASE_DIR / 'static' / 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB max upload size

# Create upload directory if it doesn't exist
UPLOAD_FOLDER.mkdir(parents=True, exist_ok=True)

# Type for Role dictionary
class RoleType(TypedDict):
    label: str
    weight: int # or float, if weights can be fractional
    score: Tuple[int, int]
    prompt: str

# Role definitions
ROLES: List[RoleType] = [
    {
        "label": "civilian villager",
        "weight": 40,
        "score": (5, 35),
        "prompt": "Naruto-style anime portrait of a Hidden Leaf Village civilian. Close-up head and shoulders. Wearing modern ninja-world casual clothes like a hooded vest, layered shirt, or light tunic in greens, browns, or muted colors. No forehead protector. Hair should be practical or spiky. Calm or cheerful expression. Background: wooden buildings, hanging signs, laundry lines, or village streets — softly blurred with warm lighting."
    },
    {
        "label": "young Genin",
        "weight": 20,
        "score": (30, 55),
        "prompt": "Close-up anime portrait of a newly graduated ninja. Wearing a headband, fingerless gloves, and a short-sleeve tactical shirt. Wide, hopeful eyes. Background: sunny training ground with trees and logs, lightly blurred."
    },
    {
        "label": "Chūnin",
        "weight": 15,
        "score": (45, 65),
        "prompt": "Close-up head-and-shoulders portrait of a mid-ranked ninja. Wearing green tactical flak jacket, serious but kind expression. Headband clearly visible. Background: village street near mission office, stylized blur."
    },
    {
        "label": "elite Jōnin",
        "weight": 10,
        "score": (55, 75),
        "prompt": "Anime portrait of an elite ninja. Wearing flak vest over long-sleeve black ninja gear, with visible forehead protector. Sharp, confident look. Background: distant mountains and trees, artistically blurred."
    },
    {
        "label": "Rogue ninja",
        "weight": 4,
        "score": (60, 80),
        "prompt": "Anime portrait of a rogue ninja. Close-up face and shoulders. Wearing a slashed headband, torn cloak, grim expression. Background: rocky ruins or broken bridge, cloudy sky, desaturated blur."
    },
    {
        "label": "Akatsuki member",
        "weight": 3,
        "score": (75, 95),
        "prompt": "Close-up anime portrait of a mysterious group member. Wearing iconic black cloak with red clouds, slashed headband, and intense red or purple eyes. Background: lightning-lit sky and crumbled temple in far distance, blurred."
    },
    {
        "label": "Anbu Black Ops",
        "weight": 3,
        "score": (70, 90),
        "prompt": "Close-up portrait of a special ops ninja. Wearing black armor, flak vest, and a cat-style mask held at their side. Headband visible. Eyes serious and alert. Background: high rooftops at night, village skyline behind mist."
    },
    {
        "label": "Hidden Leaf teacher",
        "weight": 3,
        "score": (50, 70),
        "prompt": "Anime portrait of an academy teacher. Wearing a dark tunic with scroll pouch, holding a chalk or lesson scroll. Warm, kind expression. Background: wooden training yard fence and academy windows, softly blurred."
    },
    {
        "label": "Hokage",
        "weight": 2,
        "score": (90, 100),
        "prompt": "Close-up anime portrait of a village leader. Wearing the traditional white cloak with red flame trim and leader's headpiece. Calm and wise smile. Background: the monument of past leaders, softly blurred."
    }
] 