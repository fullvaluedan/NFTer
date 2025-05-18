import os
import replicate
import requests
import random
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
            headers={
                "Authorization": f"Token {os.environ['REPLICATE_API_TOKEN']}"
            })
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
    roles = [{
        "label":
        "civilian villager",
        "description":
        "wearing modest clothes in browns or greens, soft smile, no headband, background of wooden buildings"
    }, {
        "label":
        "young Genin",
        "description":
        "Leaf headband, fingerless gloves, basic ninja outfit, hopeful look, trees in the background"
    }, {
        "label":
        "Chūnin",
        "description":
        "green flak jacket, confident expression, short cropped hair, mission-ready"
    }, {
        "label":
        "elite Jōnin",
        "description":
        "ninja headband with battle-ready gear, focused intense eyes, scars or facial detail"
    }, {
        "label":
        "Anbu Black Ops",
        "description":
        "animal mask covering face, dark armor, mysterious vibe, misty background"
    }, {
        "label":
        "Rogue ninja",
        "description":
        "scratched headband, torn cloak, rebellious eyes, cloudy background"
    }, {
        "label":
        "Akatsuki member",
        "description":
        "black cloak with red clouds, intense expression, rainy or moody background"
    }, {
        "label":
        "Hidden Leaf teacher",
        "description":
        "casual outfit with clipboard or scroll, warm friendly expression, classroom setting"
    }, {
        "label":
        "Hokage",
        "description":
        "traditional Hokage robes, formal headpiece, wise expression, background of stone faces"
    }]
    selected = random.choice(roles)
    selected_role = selected["label"]
    role_desc = selected["description"]
    prompt_text = f"""Convert this person into a Naruto anime character drawn in the exact style of the Naruto anime. Preserve the person's facial structure. Make it a 2D close-up portrait.

    This character is a {selected_role} from the Hidden Leaf Village — {role_desc}. Use clothing, accessories, and colors inspired by Naruto character designs (e.g., ninja vests, headbands, cloaks). The background should be soft, in the style of traditional Naruto scenes like villages, forests, or training fields. Use bright lighting, simple textures, and a slight blur. Image should be 1024x1024 pixels."""

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
                "prompt": prompt_text,
                "num_outputs": 3,
                "main_face_image": open(image_path, "rb")
            })
        print(f"✅ Output received: {output}")

        # Convert the FileOutput objects to URLs
        if isinstance(output, list):
            output_urls = [str(url) for url in output]
        else:
            output_urls = [str(output)]

        print(f"✅ Output URLs: {output_urls}")

        def score_for(role):
            weights = {
                "civilian villager": (0, 40),
                "young Genin": (30, 60),
                "Chūnin": (40, 70),
                "elite Jōnin": (60, 85),
                "Anbu Black Ops": (70, 90),
                "Rogue ninja": (60, 90),
                "Akatsuki member": (80, 100),
                "Hidden Leaf teacher": (50, 80),
                "Hokage": (90, 100)
            }
            low, high = weights.get(selected_role, (30, 70))
            return random.randint(low, high)

        scores = [score_for(selected_role) for _ in output_urls]
        return jsonify({
            "image_urls": output_urls,
            "role": selected_role,
            "scores": scores
        })

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
                    "prompt":
                    "Fantasy character style, close-up portrait, detailed features, vibrant colors, sharp lines, 1024x1024",
                    "main_face_image": image_url
                })
            print(f"✅ Output received: {output}")
            return jsonify({"image_urls": output})

        except Exception as inner_e:
            print(f"❌ Alternative method failed: {str(inner_e)}")
            return jsonify({
                "error":
                f"Failed to process image: {error_message}. Alternative method also failed: {str(inner_e)}"
            }), 500
