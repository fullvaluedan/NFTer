import os
import logging
import replicate
import requests
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from dotenv import load_dotenv
from werkzeug.utils import secure_filename
import uuid
import random

# Setup logging - only show INFO and above, with a cleaner format
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
else:
    os.environ["REPLICATE_API_TOKEN"] = replicate_token
    logging.info("Replicate API token loaded successfully")

# Configure application
app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "default-secret-key")
CORS(app)

# Configure upload settings
UPLOAD_FOLDER = 'static/uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

# Create upload directory if it doesn't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
logging.info(f"Upload directory configured at: {UPLOAD_FOLDER}")

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max upload size

# Define the roles and their prompts
ROLES = [
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

def allowed_file(filename):
    """Check if the file has an allowed extension"""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def get_role_prompt(selected_role=None):
    """Get the prompt for the selected role or choose a random one"""
    if selected_role:
        role = next((r for r in ROLES if r["label"] == selected_role), None)
        if role:
            return role["label"], role["prompt"], role["score"]
    
    # If no role selected or invalid role, choose randomly based on weights
    weights = [r["weight"] for r in ROLES]
    role = random.choices(ROLES, weights=weights, k=1)[0]
    return role["label"], role["prompt"], role["score"]

@app.route('/')
def index():
    """Render the main page"""
    logging.info("Rendering main page")
    return render_template('index.html')

@app.route('/generate', methods=['POST'])
def generate():
    """Process image upload and transform image"""
    logging.info("Received image generation request")
    
    # Get selected role from form data
    selected_role = request.form.get("selected_role")
    logging.info(f"Selected role: {selected_role}")
    
    # Get role prompt and score range
    role_label, prompt, score_range = get_role_prompt(selected_role)
    logging.info(f"Using role: {role_label} with prompt: {prompt[:100]}...")
    
    # Check if file was submitted
    if 'image' not in request.files:
        logging.error("No file part in request")
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['image']
    
    # Check if file is empty
    if file.filename == '':
        logging.error("No selected file")
        return jsonify({'error': 'No selected file'}), 400
    
    # Check if file exists and has filename
    if not file or not file.filename:
        logging.error("No valid file selected")
        return jsonify({'error': 'No valid file selected'}), 400
        
    # Check if file is allowed
    if not allowed_file(file.filename):
        logging.error(f"File type not allowed: {file.filename}")
        return jsonify({'error': 'File type not allowed. Please upload an image (PNG, JPG, JPEG, GIF)'}), 400
    
    try:
        # Save the file with a unique name to prevent overwriting
        unique_filename = f"{uuid.uuid4()}_{secure_filename(file.filename)}"
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
        file.save(filepath)
        
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
            
            # Convert FileOutput objects to URLs
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
            
            # Generate scores based on the role's score range
            scores = [random.randint(score_range[0], score_range[1]) for _ in image_urls]
            
            # Return the response in the format expected by the frontend
            return jsonify({
                'image_urls': image_urls,
                'role': role_label,
                'scores': scores
            })
            
        except Exception as e:
            logging.error(f"Error during Replicate API transformation: {str(e)}")
            return jsonify({'error': f'Failed to transform image: {str(e)}'}), 500
            
    except Exception as e:
        logging.error(f"Error saving file: {str(e)}")
        return jsonify({'error': f'Failed to process upload: {str(e)}'}), 500

if __name__ == '__main__':
    logging.info("Starting Flask application")
    app.run(host='0.0.0.0', port=5000, debug=True)
