import os
from pathlib import Path
from unittest.mock import patch

import pytest
from fastapi.testclient import TestClient
from PIL import Image

from nfter.app import app # Assuming your FastAPI app instance is named 'app' in nfter/app.py

client = TestClient(app)

@pytest.fixture
def test_image_path():
    # Create a dummy test image file
    img_path = Path('test_image.png')
    try:
        # Create a small, simple PNG image for testing
        img = Image.new('RGB', (60, 30), color = 'red')
        img.save(img_path, "PNG")
        yield img_path
    finally:
        # Cleanup: remove the image file after the test
        if img_path.exists():
            img_path.unlink()

@pytest.mark.asyncio
async def test_generate_endpoint_with_image_and_role(test_image_path: Path):
    with patch('nfter.app.replicate.run') as mock_replicate_run:
        mock_replicate_run.return_value = [
            "https://example.com/generated_image1.png",
            "https://example.com/generated_image2.png"
        ]
        
        selected_role = "elite Jōnin" # Example role from your config

        with open(test_image_path, 'rb') as f:
            response = client.post(
                "/generate",
                files={"image": (test_image_path.name, f, "image/png")},
                data={"selected_role": selected_role}
            )
        
        assert response.status_code == 200
        data = response.json()
        assert "image_urls" in data
        assert len(data["image_urls"]) == 2
        assert data["image_urls"][0] == "https://example.com/generated_image1.png"
        assert data["role"] == selected_role
        assert "scores" in data
        assert len(data["scores"]) == 2
        # Add more specific score checks if necessary, based on the role's score range

@pytest.mark.asyncio
async def test_generate_endpoint_with_image_no_role(test_image_path: Path):
    with patch('nfter.app.replicate.run') as mock_replicate_run:
        # Mock the Replicate API response
        mock_replicate_run.return_value = [
            "https://example.com/generated_image_random.png"
        ]

        with open(test_image_path, 'rb') as f:
            response = client.post(
                "/generate",
                files={"image": (test_image_path.name, f, "image/png")}
            )
        
        assert response.status_code == 200
        data = response.json()
        assert "image_urls" in data
        assert len(data["image_urls"]) == 1
        assert "role" in data # Role should be a string (randomly selected one)
        assert isinstance(data["role"], str)
        assert "scores" in data
        assert len(data["scores"]) == 1

@pytest.mark.asyncio
async def test_generate_endpoint_invalid_file_type():
    # Create a dummy text file
    txt_file_path = Path("test_file.txt")
    with open(txt_file_path, "wb") as f:
        f.write(b"This is not an image.")

    try:
        with open(txt_file_path, 'rb') as f:
            response = client.post(
                "/generate",
                files={"image": (txt_file_path.name, f, "text/plain")}
            )
        assert response.status_code == 400
        # Assuming your app returns JSON with a "detail" field for HTTPExceptions
        assert "File type not allowed" in response.json()["detail"]
    finally:
        if txt_file_path.exists():
            txt_file_path.unlink()

@pytest.mark.asyncio
async def test_generate_endpoint_file_too_large(test_image_path: Path):
    # For this test, we'll mock MAX_CONTENT_LENGTH to be very small
    with patch('nfter.app.MAX_CONTENT_LENGTH', 10): # Mock to 10 bytes
        with open(test_image_path, 'rb') as f:
            response = client.post(
                "/generate",
                files={"image": (test_image_path.name, f, "image/png")}
            )
        assert response.status_code == 400
        assert "File too large" in response.json()["detail"]

@pytest.mark.asyncio
async def test_generate_endpoint_no_file():
    response = client.post("/generate")
    # FastAPI typically returns 422 for missing multipart file unless handled differently
    assert response.status_code == 422 

@pytest.mark.asyncio
async def test_replicate_api_failure(test_image_path: Path):
    with patch('nfter.app.replicate.run') as mock_replicate_run:
        mock_replicate_run.side_effect = Exception("Replicate API is down")

        with open(test_image_path, 'rb') as f:
            response = client.post(
                "/generate",
                files={"image": (test_image_path.name, f, "image/png")},
                data={"selected_role": "civilian villager"}
            )
        
        assert response.status_code == 500
        assert "Failed to transform image" in response.json()["detail"]
        assert "Replicate API is down" in response.json()["detail"] 