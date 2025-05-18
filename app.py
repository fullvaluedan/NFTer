import os
import logging
import replicate
import requests
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from dotenv import load_dotenv
from werkzeug.utils import secure_filename
import uuid

# Setup logging
logging.basicConfig(level=logging.DEBUG)

# Load environment variables
load_dotenv()

# Ensure Replicate API token is set
replicate_token = os.getenv("REPLICATE_API_TOKEN")
if not replicate_token:
    logging.warning("REPLICATE_API_TOKEN not found in environment variables")
else:
    os.environ["REPLICATE_API_TOKEN"] = replicate_token

# Configure application
app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "default-secret-key")
CORS(app)

# Configure upload settings
UPLOAD_FOLDER = 'static/uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

# Create upload directory if it doesn't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max upload size

def allowed_file(filename):
    """Check if the file has an allowed extension"""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def upload_image_to_fileio(image_path):
    """Upload an image to file.io and return the URL"""
    try:
        with open(image_path, "rb") as f:
            response = requests.post("https://file.io", files={"file": f})
            return response.json().get("link")
    except Exception as e:
        logging.error(f"Error uploading to file.io: {str(e)}")
        return None

@app.route('/')
def index():
    """Render the main page"""
    return render_template('index.html')

@app.route('/generate', methods=['POST'])
def generate():
    """Process image upload and transform image"""
    # Check if file was submitted
    if 'image' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['image']
    
    # Check if file is empty
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    # Check if file exists and has filename
    if not file or not file.filename:
        return jsonify({'error': 'No valid file selected'}), 400
        
    # Check if file is allowed
    if not allowed_file(file.filename):
        return jsonify({'error': 'File type not allowed. Please upload an image (PNG, JPG, JPEG, GIF)'}), 400
    
    try:
        # Save the file with a unique name to prevent overwriting
        unique_filename = f"{uuid.uuid4()}_{secure_filename(file.filename)}"
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
        file.save(filepath)
        
        logging.debug(f"Image saved at {filepath}")
        
        # Upload image to file.io to get a public URL
        image_url = upload_image_to_fileio(filepath)
        if not image_url:
            return jsonify({'error': 'Image upload failed'}), 500
        
        # Process the image using the Replicate API
        try:
            output = replicate.run(
                "bytedance/pulid:43d309c37ab4e62361e5e29b8e9e867fb2dcbcec77ae91206a8d95ac5dd451a0",
                input={
                    "prompt": "Fantasy character style, close-up portrait, detailed features, vibrant colors, sharp lines, 1024x1024",
                    "main_face_image": image_url
                }
            )
            
            logging.debug(f"Transformation result: {output}")
            
            # Return the URL of the generated image
            return jsonify({'image_url': output[0] if isinstance(output, list) else output, 'status': 'success'})
            
        except Exception as e:
            logging.error(f"Error during transformation: {str(e)}")
            return jsonify({'error': f'Failed to transform image: {str(e)}'}), 500
            
    except Exception as e:
        logging.error(f"Error saving file: {str(e)}")
        return jsonify({'error': f'Failed to process upload: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
