# NFTer - Anime Character Generator

Transform your photos into Naruto-style anime characters using AI. This application uses a FastAPI backend with a React frontend to generate anime-style portraits with different character roles from the Naruto universe.

## Features

- Upload your photo and transform it into an anime character
- Choose from various Naruto-style roles:
  - Civilian Villager
  - Young Genin
  - Chūnin
  - Elite Jōnin
  - Rogue Ninja
  - Akatsuki Member
  - Anbu Black Ops
  - Hidden Leaf Teacher
  - Hokage
- Get a power score based on your character's role
- Modern, responsive UI with real-time feedback

## Architecture

This is a monorepo containing both the backend and frontend applications:

### Backend (FastAPI)

- Handles HTTP requests and API endpoints
- Processes image uploads and transformations
- Communicates with the Replicate API
- Manages file storage and cleanup
- Runs on port 5000

### Frontend (React + Vite)

- Modern React application with TypeScript
- Shadcn UI components
- Tailwind CSS for styling
- Custom animations and transitions
- Runs on port 5173

### API Endpoints

- `POST /generate`: Handles image upload and transformation
  - Accepts: image file and optional role selection
  - Returns: transformed image URLs, role, and power scores

## Project Structure

```
NFTer/
├── backend/                 # FastAPI application
│   ├── src/
│   │   └── nfter/         # Main application code
│   │       ├── app.py     # FastAPI application
│   │       ├── config.py  # Configuration settings
│   │       └── utils.py   # Utility functions
│   ├── tests/             # Test files
│   ├── pyproject.toml     # Python dependencies and project config
│   └── .env              # Backend environment variables
│
├── frontend/               # React application
│   ├── src/              # React source code
│   │   ├── components/   # React components
│   │   ├── pages/       # Page components
│   │   ├── lib/         # Utility functions
│   │   └── App.tsx      # Main React component
│   ├── package.json     # Node.js dependencies
│   └── .env            # Frontend environment variables
│
└── README.md             # This file
```

## Prerequisites

### Backend

- Python 3.8 or higher
- A Replicate API token (get one at [replicate.com](https://replicate.com))

### Frontend

- Node.js 16 or higher
- npm or yarn

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/NFTer.git
cd NFTer
```

2. Set up the backend:

```bash
# Create and activate virtual environment
cd backend
python -m venv .venv
source .venv/bin/activate  # or .\venv\Scripts\activate on Windows

# Install dependencies
pip install -e ".[dev]"

# Create .env file
echo "REPLICATE_API_TOKEN=your_token_here" > .env
```

3. Set up the frontend:

```bash
# Install dependencies
cd frontend
npm install

# Create .env file
echo "VITE_API_URL=http://localhost:5000" > .env
```

## Running the Application

1. Start the backend (port 5000):

```bash
cd backend
source .venv/bin/activate  # or .\venv\Scripts\activate on Windows
uvicorn src.nfter.app:app --reload --port 5000
```

2. In a new terminal, start the frontend (port 5173):

```bash
cd frontend
npm run dev
```

3. Access the applications:

- Frontend: Open your web browser and navigate to `http://localhost:5173`
- Backend API documentation: Visit `http://localhost:5000/docs`

## Development

### Backend Development

- The FastAPI backend runs on port 5000
- API documentation available at `http://localhost:5000/docs`
- Uses pytest for testing
- Type checking with mypy

### Frontend Development

- React development server runs on port 5173
- Uses Vite for fast development
- Hot module replacement enabled
- TypeScript for type safety
- Tailwind CSS for styling
- Shadcn UI components
- API requests are automatically proxied to the backend via Vite's proxy configuration

## Environment Variables

### Backend (.env in backend/ directory)

```
REPLICATE_API_TOKEN=your_token_here
```

### Frontend (.env in frontend/ directory)

```
# Development: No environment variables needed
# Production: Set your deployed backend URL
VITE_API_URL=http://localhost:5000  # Development
# VITE_API_URL=https://your-backend-url.com  # Production
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Replicate](https://replicate.com) for the AI model
- [FastAPI](https://fastapi.tiangolo.com/) web framework
- [React](https://reactjs.org/) frontend library
- [Shadcn UI](https://ui.shadcn.com/) for UI components
- [Tailwind CSS](https://tailwindcss.com/) for styling

## Deployment

### Important Note

This project requires separate deployments for the frontend and backend:

- Frontend: Deploy to Vercel
- Backend: Deploy to a Python-compatible hosting service

### Backend Deployment

The backend must be deployed to a Python-compatible hosting service that can run FastAPI applications. Some options include:

- [Railway](https://railway.app/)
- [Render](https://render.com/)
- [Heroku](https://www.heroku.com/)
- [DigitalOcean](https://www.digitalocean.com/)

1. Set up your environment variables:

   - `REPLICATE_API_TOKEN`: Your Replicate API token

2. Deploy your FastAPI application:

   ```bash
   # Example using uvicorn in production
   uvicorn src.nfter.app:app --host 0.0.0.0 --port $PORT
   ```

3. After deployment, note your backend URL (e.g., `https://your-backend-url.com`)

### Frontend Deployment (Vercel)

1. Create a new project in Vercel and connect your repository

2. Configure environment variables in Vercel:

   - `VITE_API_URL`: Your deployed backend URL from step 3 above

3. Build settings:

   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Root Directory: `frontend` (important: specify the frontend directory)

4. Deploy your application

### Production Considerations

- Update CORS settings in the backend to allow requests from your Vercel frontend domain
- Ensure all API endpoints are properly secured
- Set up proper error handling and logging
- Consider using environment-specific configuration files
- Make sure your backend service can handle the expected load
