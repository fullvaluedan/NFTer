# NFTer Backend

The backend service for the NFTer application, which generates Naruto-style anime avatars using AI.

## Features

- FastAPI-based REST API
- Image upload and processing
- Integration with Replicate API for AI image generation
- Role-based avatar generation with weighted randomization
- Power level scoring system

## Prerequisites

- Python 3.8 or higher
- Replicate API token

## Installation

1. Create a virtual environment:

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:

   ```bash
   pip install -e ".[dev]"
   ```

3. Create a `.env` file in the project root:
   ```
   REPLICATE_API_TOKEN=your_token_here
   ```

## Development

1. Install development dependencies:

   ```bash
   pip install -e ".[dev]"
   ```

2. Run the development server:

   ```bash
   uvicorn nfter.app:app --reload
   ```

3. Access the API documentation at `http://localhost:5000/docs`

## API Endpoints

### POST /generate

Generate a Naruto-style anime avatar from an uploaded image.

**Request:**

- `image`: Image file (PNG, JPG, JPEG, GIF)
- `selected_role`: Optional role selection

**Response:**

```json
{
  "image_urls": ["url1", "url2", ...],
  "role": "selected_role",
  "scores": [score1, score2, ...]
}
```

## Testing

Run tests with pytest:

```bash
pytest
```

## Code Style

This project uses:

- Black for code formatting
- isort for import sorting
- mypy for type checking

Run the formatters:

```bash
black .
isort .
mypy .
```
