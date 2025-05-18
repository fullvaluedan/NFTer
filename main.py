
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

def upload_image_to_fileio(image_path):
    with open(image_path, "rb") as f:
        response = requests.post("https://file.io", files={"file": f})
        return response.json().get("link")

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/generate", methods=["POST"])
def generate_image():
    image_file = request.files["image"]
    image_path = "input.jpg"
    image_file.save(image_path)

    image_url = upload_image_to_fileio(image_path)
    if not image_url:
        return jsonify({"error": "Image upload failed"}), 500

    output = replicate.run(
        "bytedance/pulid:43d309c37ab4e62361e5e29b8e9e867fb2dcbcec77ae91206a8d95ac5dd451a0",
        input={
            "prompt": "Fantasy character style, close-up portrait, detailed features, vibrant colors, sharp lines, 1024x1024",
            "main_face_image": image_url
        }
    )

    return jsonify({"image_urls": output})

