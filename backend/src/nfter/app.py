"""Main FastAPI application for the NFTer backend."""

import os
import logging
import uuid
from pathlib import Path
from typing import List

import replicate
from fastapi import FastAPI, File, Form, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from dotenv import load_dotenv

from .config import UPLOAD_FOLDER, MAX_CONTENT_LENGTH
from .utils import allowed_file, get_role_prompt, generate_scores

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)

# Load environment variables
load_dotenv()

# Ensure Replicate API token is set
replicate_token = os.getenv("REPLICATE_API_TOKEN")
if not replicate_token:
    logging.error("REPLICATE_API_TOKEN not found in environment variables")
    raise ValueError("REPLICATE_API_TOKEN environment variable is required")
os.environ["REPLICATE_API_TOKEN"] = replicate_token
logging.info("Replicate API token loaded successfully")

# Create FastAPI app
app = FastAPI(
    title="NFTer API",
    description="API for generating Naruto-style anime avatars",
    version="0.1.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files
app.mount("/static", StaticFiles(directory=str(UPLOAD_FOLDER)), name="static")

class GenerationResponse(BaseModel):
    """Response model for image generation."""
    image_urls: List[str]
    role: str
    scores: List[int]

@app.post("/generate", response_model=GenerationResponse)
async def generate_avatar(
    image: UploadFile = File(...),
    selected_role: str = Form(None)
) -> GenerationResponse:
    """Process image upload and transform image."""
    logging.info("Received image generation request")
    
    # Get role prompt and score range
    role_label, prompt, score_range = get_role_prompt(selected_role)
    logging.info(f"Using role: {role_label} with prompt: {prompt[:100]}...")
    
    # Check if file is allowed
    if not image.filename or not allowed_file(image.filename):
        raise HTTPException(
            status_code=400,
            detail="File type not allowed. Please upload an image (PNG, JPG, JPEG, GIF)"
        )
    
    filepath = None # Initialize filepath to ensure it's defined in finally block
    try:
        # Save the file with a unique name
        unique_filename = f"{uuid.uuid4()}_{image.filename}"
        filepath = UPLOAD_FOLDER / unique_filename
        
        # Save uploaded file
        with open(filepath, "wb") as f:
            content = await image.read()
            if len(content) > MAX_CONTENT_LENGTH:
                # This HTTPException should be caught by the dedicated block below
                raise HTTPException(
                    status_code=400,
                    detail="File too large. Maximum size is 16MB"
                )
            f.write(content)
        
        logging.info(f"Image saved successfully at {filepath}")
        
        # Process the image using the Replicate API
        try:
            logging.info("Sending image to Replicate API for transformation")
            output = replicate.run(
                "bytedance/pulid:43d309c37ab4e62361e5e29b8e9e867fb2dcbcec77ae91206a8d95ac5dd451a0",
                input={
                    "prompt": prompt,
                    "main_face_image": open(filepath, "rb")
                }
            )
            
            logging.info(f"Successfully received transformation result: {output}")
            
            image_urls = []
            if isinstance(output, list):
                for file_output in output:
                    if hasattr(file_output, 'url'):
                        image_urls.append(file_output.url)
                    else:
                        image_urls.append(str(file_output))
            else:
                if hasattr(output, 'url'):
                    image_urls.append(output.url)
                else:
                    image_urls.append(str(output))
            
            logging.info(f"Converted image URLs: {image_urls}")
            
            scores = generate_scores(score_range, len(image_urls))
            
            return GenerationResponse(
                image_urls=image_urls,
                role=role_label,
                scores=scores
            )
            
        except Exception as e: # Specific to Replicate API errors
            logging.error(f"Error during Replicate API transformation: {str(e)}")
            # This will be caught by the outer HTTPException handler if not handled otherwise
            # or directly by FastAPI if it's an HTTPException
            raise HTTPException(
                status_code=500,
                detail=f"Failed to transform image: {str(e)}"
            )

    except HTTPException as http_exc: # Catches HTTPExceptions from file validation (size, type) etc.
        logging.error(f"HTTP exception occurred during processing: {http_exc.detail}")
        raise http_exc # Re-raise to let FastAPI handle it correctly
            
    except Exception as e: # Catches other unexpected errors during file saving or other logic
        logging.error(f"Unexpected error processing upload: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Unexpected error processing upload: {str(e)}"
        )
    finally:
        if filepath and os.path.exists(filepath):
            try:
                os.remove(filepath)
            except Exception as e:
                logging.error(f"Error removing temporary file {filepath}: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000) 