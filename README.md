# NFTer - Anime Character Generator

Transform your photos into Naruto-style anime characters using AI. This Flask web application uses the Replicate API to generate anime-style portraits with different character roles from the Naruto universe.

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

## Prerequisites

- Python 3.8 or higher
- pip (Python package manager)
- A Replicate API token (get one at [replicate.com](https://replicate.com))

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/NFTer.git
cd NFTer
```

2. Create and activate a virtual environment:

```bash
# On Windows
python -m venv venv
.\venv\Scripts\activate

# On macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

3. Install dependencies:

```bash
pip install -r requirements.txt
```

4. Create a `.env` file in the project root and add your Replicate API token:

```bash
REPLICATE_API_TOKEN=your_token_here
```

## Running the Application

1. Make sure your virtual environment is activated

2. Start the Flask server:

```bash
python app.py
```

3. Open your web browser and navigate to:

```
http://localhost:5000
```

## Usage

1. Click the "Choose File" button to select an image from your computer
2. Select a character role from the dropdown menu (optional)
3. Click "Transform" to generate your anime character
4. View your transformed image and character stats
5. Download the generated image if desired

## Project Structure

```
NFTer/
├── app.py              # Main application file
├── requirements.txt    # Python dependencies
├── .env               # Environment variables (create this)
├── static/
│   ├── css/
│   │   └── style.css  # Stylesheet
│   ├── js/
│   │   └── script.js  # Frontend JavaScript
│   └── uploads/       # Temporary storage for uploaded images
└── templates/
    └── index.html     # Main page template
```

## Environment Variables

Create a `.env` file in the project root with the following variables:

```
REPLICATE_API_TOKEN=your_token_here
SESSION_SECRET=your_secret_here  # Optional, for session security
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
- [Flask](https://flask.palletsprojects.com/) web framework
- [Bootstrap](https://getbootstrap.com/) for the UI components
