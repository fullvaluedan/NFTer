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
    roles = [
        { "label": "civilian villager", "weight": 40, "score": (5, 35), "description": "non-ninja resident", "visual": "wearing plain clothes in earthy colors, with a peaceful expression", "prompt": "Anime character, close-up portrait. Wearing simple earth-toned tunic, no headband, calm and peaceful expression. Background is a village market with wooden buildings and hanging signs, blurred for focus." },
        { "label": "young Genin", "weight": 20, "score": (30, 55), "description": "newly graduated ninja", "visual": "wearing a simple forehead protector, utility vest, and determined eyes", "prompt": "Anime character, close-up head and shoulders. Wearing dark shirt, headband on forehead, fingerless gloves, hopeful youthful look. Background is forest training field, lightly blurred." },
        { "label": "Chūnin", "weight": 15, "score": (45, 65), "description": "mid-ranked field ninja", "visual": "wearing a green vest, tactical gear, and calm focus", "prompt": "Anime close-up. Wears tactical green vest, small utility pouch, confident smile. Headband visible. Background shows a mission gate entrance, subtle and soft-blurred." },
        { "label": "elite Jōnin", "weight": 10, "score": (55, 75), "description": "top-ranked ninja", "visual": "wearing a high-collared flak jacket, gloves, and a strong, confident look", "prompt": "Close-up anime portrait. Wearing reinforced flak jacket, scars or facial detail, strong expression, one eyebrow slightly raised. Background is a distant mountain range near the village border." },
        { "label": "Rogue ninja", "weight": 4, "score": (60, 80), "description": "banished or runaway ninja", "visual": "wearing a scratched headband, a torn cloak, and a grim expression", "prompt": "Anime portrait, close-up with gritty details. Scratched forehead protector worn like a bandana, torn dark cloak, rebellious eyes. Background: moody ruined bridge or rocky canyon, blurred for depth." },
        { "label": "Akatsuki member", "weight": 3, "score": (75, 95), "description": "member of a notorious rogue group", "visual": "wearing a black cloak with red clouds, intense stare, and cloudy background", "prompt": "Anime portrait. Black cloak with red clouds, serious or evil expression, headband slashed, red-tinted eyes. Background: stormy sky with broken pillars, slightly blurred." },
        { "label": "Anbu Black Ops", "weight": 3, "score": (70, 90), "description": "covert elite ninja unit", "visual": "wearing a porcelain animal mask, black tactical armor, and surrounded by mist", "prompt": "Close-up anime character. Tactical armor, headband, fox or cat mask clipped to side of waist or held in hand. Background: mist-covered rooftops at night, faded for depth." },
        { "label": "Hidden Leaf teacher", "weight": 3, "score": (50, 70), "description": "academy instructor", "visual": "wearing robes and holding a scroll, with a warm smile", "prompt": "Anime portrait with kind face, wearing long-sleeve tunic and scroll belt. Holding chalk or book, eyes slightly smiling. Background: academy classroom or wooden fence with training targets." },
        { "label": "Hokage", "weight": 2, "score": (90, 100), "description": "leader of the village", "visual": "wearing white and red robes and hat, standing with a commanding presence", "prompt": "Anime close-up. Wearing red and white robes, headpiece present or stylized. Calm, wise smile. Background shows blurred monument or paper window with sunlight rays." }
    ]
    
    role_lookup = {r["label"]: r for r in roles}
    weights = [r["weight"] for r in roles]
    
    manual_label = request.form.get("selected_role")
    if manual_label and manual_label in role_lookup:
        selected = role_lookup[manual_label]
    else:
        selected = random.choices(roles, weights=weights, k=1)[0]
        
    selected_role = selected["label"]
    role_desc = selected["description"]
    visual_traits = selected["visual"]
    prompt_text = selected["prompt"]
    # Use either the provided prompt or fall back to a detailed one
    if not prompt_text or prompt_text.strip() == "":
        prompt_text = f"""
        Convert this person into an anime character drawn in a fantasy anime style. Preserve the person's facial structure and expression. Use cel-shaded coloring, bold black outlines, and expressive anime-style eyes.

        This character is a {selected_role} ({role_desc}). They are {visual_traits}.

        Use vibrant anime-style coloring. Do not use grayscale. The composition should be centered, zoomed-in, and clean. Crop the image to a close-up portrait focused on the face and shoulders only. Avoid full body shots or wide angles.

        Use a minimal anime-style background that complements the character. Blur it slightly to keep focus on the character. Final output must be 1024x1024 resolution in full color.
        """

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
            low, high = selected["score"]
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
