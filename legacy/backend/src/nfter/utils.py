"""Utility functions for the NFTer backend."""

import random
from typing import Optional, Tuple, List
from .config import ROLES

def allowed_file(filename: str) -> bool:
    """Check if the file has an allowed extension."""
    from .config import ALLOWED_EXTENSIONS
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def get_role_prompt(selected_role: Optional[str] = None) -> Tuple[str, str, Tuple[int, int]]:
    """Get the prompt for the selected role or choose a random one."""
    if selected_role:
        role = next((r for r in ROLES if r["label"] == selected_role), None)
        if role:
            return role["label"], role["prompt"], role["score"]
    
    # If no role selected or invalid role, choose randomly based on weights
    weights = [r["weight"] for r in ROLES]
    role = random.choices(ROLES, weights=weights, k=1)[0]
    return role["label"], role["prompt"], role["score"]

def generate_scores(score_range: Tuple[int, int], count: int) -> List[int]:
    """Generate random scores within the given range."""
    return [random.randint(score_range[0], score_range[1]) for _ in range(count)] 