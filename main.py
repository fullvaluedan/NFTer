
import os
import replicate
import requests
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()
replicate_token = os.getenv("REPLICATE_API_TOKEN")
if replicate_token:
    os.environ["REPLICATE_API_TOKEN"] = replicate_token

app = Flask(__name__)
CORS(app)

def upload_to_replicate(image_path):
    with open(image_path, "rb") as f:
        response = requests.post(
            "https://dreambooth-api-experimental.replicate.com/v1/upload",
            files={"file": f},
            headers={"Authorization": f"Token {os.environ['REPLICATE_API_TOKEN']}"}
        )
    print("Upload response status:", response.status_code)
    print("Raw response:", response.text)

    try:
        data = response.json()
        return data.get("upload_url")
    except Exception as e:
        print("❌ JSON decode error:", e)
        return None

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/generate", methods=["POST"])
def generate_image():
    if 'image' not in request.files:
        return jsonify({"error": "No image file provided"}), 400
    
    image_file = request.files["image"]
    if not image_file or image_file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    # Save the uploaded file
    image_path = "input.jpg"
    image_file.save(image_path)
    print(f"✅ Image saved successfully at {image_path}")

    try:
        # Try using the Replicate API directly with the file
        print("🔄 Running Replicate API with local file...")
        output = replicate.run(
            "bytedance/pulid:43d309c37ab4e62361e5e29b8e9e867fb2dcbcec77ae91206a8d95ac5dd451a0",
            input={
                "prompt": "Fantasy character style, close-up portrait, detailed features, vibrant colors, sharp lines, 1024x1024",
                "main_face_image": open(image_path, "rb")
            }
        )
        print(f"✅ Output received: {output}")
        return jsonify({"image_urls": output})
        
    except Exception as e:
        error_message = str(e)
        print(f"❌ Error: {error_message}")
        
        # If there's an issue with direct file upload, try the upload_to_replicate method
        try:
            print("🔄 Attempting alternative upload method...")
            image_url = upload_to_replicate(image_path)
            if not image_url:
                return jsonify({"error": "Image upload failed"}), 500
                
            print(f"✅ Image uploaded successfully, URL: {image_url}")
            
            output = replicate.run(
                "bytedance/pulid:43d309c37ab4e62361e5e29b8e9e867fb2dcbcec77ae91206a8d95ac5dd451a0",
                input={
                    "prompt": "Fantasy character style, close-up portrait, detailed features, vibrant colors, sharp lines, 1024x1024",
                    "main_face_image": image_url
                }
            )
            print(f"✅ Output received: {output}")
            return jsonify({"image_urls": output})
            
        except Exception as inner_e:
            print(f"❌ Alternative method failed: {str(inner_e)}")
            return jsonify({"error": f"Failed to process image: {error_message}. Alternative method also failed: {str(inner_e)}"}), 500

