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
        "weight":
        40,
        "score": (5, 35),
        "prompt":
        "Naruto-style anime portrait of a Hidden Leaf Village civilian. Close-up head and shoulders. Wearing modern ninja-world casual clothes like a hooded vest, layered shirt, or light tunic in greens, browns, or muted colors. No forehead protector. Hair should be practical or spiky. Calm or cheerful expression. Background: wooden buildings, hanging signs, laundry lines, or village streets — softly blurred with warm lighting."
    }, {
        "label":
        "young Genin",
        "weight":
        20,
        "score": (30, 55),
        "prompt":
        "Close-up anime portrait of a newly graduated ninja. Wearing a headband, fingerless gloves, and a short-sleeve tactical shirt. Wide, hopeful eyes. Background: sunny training ground with trees and logs, lightly blurred."
    }, {
        "label":
        "Chūnin",
        "weight":
        15,
        "score": (45, 65),
        "prompt":
        "Close-up head-and-shoulders portrait of a mid-ranked ninja. Wearing green tactical flak jacket, serious but kind expression. Headband clearly visible. Background: village street near mission office, stylized blur."
    }, {
        "label":
        "elite Jōnin",
        "weight":
        10,
        "score": (55, 75),
        "prompt":
        "Anime portrait of an elite ninja. Wearing flak vest over long-sleeve black ninja gear, with visible forehead protector. Sharp, confident look. Background: distant mountains and trees, artistically blurred."
    }, {
        "label":
        "Rogue ninja",
        "weight":
        4,
        "score": (60, 80),
        "prompt":
        "Anime portrait of a rogue ninja. Close-up face and shoulders. Wearing a slashed headband, torn cloak, grim expression. Background: rocky ruins or broken bridge, cloudy sky, desaturated blur."
    }, {
        "label":
        "Akatsuki member",
        "weight":
        3,
        "score": (75, 95),
        "prompt":
        "Close-up anime portrait of a mysterious group member. Wearing iconic black cloak with red clouds, slashed headband, and intense red or purple eyes. Background: lightning-lit sky and crumbled temple in far distance, blurred."
    }, {
        "label":
        "Anbu Black Ops",
        "weight":
        3,
        "score": (70, 90),
        "prompt":
        "Close-up portrait of a special ops ninja. Wearing black armor, flak vest, and a cat-style mask held at their side. Headband visible. Eyes serious and alert. Background: high rooftops at night, village skyline behind mist."
    }, {
        "label":
        "Hidden Leaf teacher",
        "weight":
        3,
        "score": (50, 70),
        "prompt":
        "Anime portrait of an academy teacher. Wearing a dark tunic with scroll pouch, holding a chalk or lesson scroll. Warm, kind expression. Background: wooden training yard fence and academy windows, softly blurred."
    }, {
        "label":
        "Hokage",
        "weight":
        2,
        "score": (90, 100),
        "prompt":
        "Close-up anime portrait of a village leader. Wearing the traditional white cloak with red flame trim and leader's headpiece. Calm and wise smile. Background: the monument of past leaders, softly blurred."
    }]

    role_lookup = {r["label"]: r for r in roles}
    weights = [r["weight"] for r in roles]

    manual_label = request.form.get("selected_role")
    if manual_label and manual_label in role_lookup:
        selected = role_lookup[manual_label]
    else:
        selected = random.choices(roles, weights=weights, k=1)[0]

    selected_role = selected["label"]
    prompt_text = selected["prompt"]
    # Add enhancement to the prompt
    prompt_text = f"""
    Convert this person into an anime character drawn in a fantasy anime style. Preserve the person's facial structure and expression. Use cel-shaded coloring, bold black outlines, and expressive anime-style eyes.

    {prompt_text}

    Create high quality anime-style art with vibrant coloring. Do not use grayscale. The composition should be centered, zoomed-in, and clean. Crop the image to a close-up portrait focused on the face and shoulders only. Avoid full body shots or wide angles. 

    Final output must be 1024x1024 resolution in full color.
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
