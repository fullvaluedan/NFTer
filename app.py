import os
import logging
import replicate
from flask import Flask, request, jsonify, render_template, flash, redirect, url_for
from flask_cors import CORS
from dotenv import load_dotenv
from werkzeug.utils import secure_filename
import uuid

# Setup logging
logging.basicConfig(level=logging.DEBUG)

# Load environment variables
load_dotenv()

# Ensure Replicate API token is set
if not os.getenv("REPLICATE_API_TOKEN"):
    logging.warning("REPLICATE_API_TOKEN not found in environment variables")

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

@app.route('/')
def index():
    """Render the main page"""
    return render_template('index.html')

@app.route('/generate', methods=['POST'])
def generate():
    """Process image upload and generate Naruto style image"""
    # Check if file was submitted
    if 'image' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['image']
    
    # Check if file is empty
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    # Check if file is allowed
    if not (file and allowed_file(file.filename)):
        return jsonify({'error': 'File type not allowed. Please upload an image (PNG, JPG, JPEG, GIF)'}), 400
    
    try:
        # Save the file with a unique name to prevent overwriting
        unique_filename = f"{uuid.uuid4()}_{secure_filename(file.filename)}"
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
        file.save(filepath)
        
        logging.debug(f"Image saved at {filepath}")
        
        # Process the image using the Replicate API
        try:
            output = replicate.run(
                "bytedance/pulid",
                input={
                    "image": open(filepath, "rb"),
                    "prompt": "Fantasy character style, close-up portrait, detailed features, vibrant colors, sharp lines, 1024x1024",
                    "guidance_scale": 7.5,
                    "num_inference_steps": 50
                }
            )
            
            logging.debug(f"Transformation result: {output}")
            
            # Return the URL of the generated image
            return jsonify({'image_url': output, 'status': 'success'})
            
        except Exception as e:
            logging.error(f"Error during transformation: {str(e)}")
            return jsonify({'error': f'Failed to transform image: {str(e)}'}), 500
            
    except Exception as e:
        logging.error(f"Error saving file: {str(e)}")
        return jsonify({'error': f'Failed to process upload: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
