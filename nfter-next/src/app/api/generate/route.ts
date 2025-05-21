import { NextResponse } from "next/server";
import Replicate from "replicate";

// Initialize Replicate client
if (!process.env.REPLICATE_API_TOKEN) {
  throw new Error("REPLICATE_API_TOKEN environment variable is not set");
}

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// Constants
const MAX_CONTENT_LENGTH = 16 * 1024 * 1024; // 16MB
const ALLOWED_EXTENSIONS = new Set(["png", "jpg", "jpeg", "gif"]);

// Types
interface ReplicateOutput {
  url?: string;
  [key: string]: unknown;
}

type ScoreRange = [number, number];

// Helper functions
function allowedFile(filename: string): boolean {
  const ext = filename.split(".").pop()?.toLowerCase();
  return ext ? ALLOWED_EXTENSIONS.has(ext) : false;
}

async function getStreamUrl(stream: ReadableStream): Promise<string> {
  const response = new Response(stream);
  const blob = await response.blob();
  const arrayBuffer = await blob.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString("base64");
  return `data:${blob.type};base64,${base64}`;
}

function getRolePrompt(selectedRole: string | null) {
  const ROLES = [
    {
      label: "civilian villager",
      weight: 40,
      score: [5, 35] as ScoreRange,
      prompt:
        "Naruto-style anime portrait of a Hidden Leaf Village civilian. Close-up head and shoulders. Wearing modern ninja-world casual clothes like a hooded vest, layered shirt, or light tunic in greens, browns, or muted colors. No forehead protector. Hair should be practical or spiky. Calm or cheerful expression. Background: wooden buildings, hanging signs, laundry lines, or village streets — softly blurred with warm lighting.",
    },
    {
      label: "young Genin",
      weight: 20,
      score: [30, 55] as ScoreRange,
      prompt:
        "Close-up anime portrait of a newly graduated ninja. Wearing a headband, fingerless gloves, and a short-sleeve tactical shirt. Wide, hopeful eyes. Background: sunny training ground with trees and logs, lightly blurred.",
    },
    {
      label: "Chūnin",
      weight: 15,
      score: [45, 65] as ScoreRange,
      prompt:
        "Close-up head-and-shoulders portrait of a mid-ranked ninja. Wearing green tactical flak jacket, serious but kind expression. Headband clearly visible. Background: village street near mission office, stylized blur.",
    },
    {
      label: "elite Jōnin",
      weight: 10,
      score: [55, 75] as ScoreRange,
      prompt:
        "Anime portrait of an elite ninja. Wearing flak vest over long-sleeve black ninja gear, with visible forehead protector. Sharp, confident look. Background: distant mountains and trees, artistically blurred.",
    },
    {
      label: "Rogue ninja",
      weight: 4,
      score: [60, 80] as ScoreRange,
      prompt:
        "Anime portrait of a rogue ninja. Close-up face and shoulders. Wearing a slashed headband, torn cloak, grim expression. Background: rocky ruins or broken bridge, cloudy sky, desaturated blur.",
    },
    {
      label: "Akatsuki member",
      weight: 3,
      score: [75, 95] as ScoreRange,
      prompt:
        "Close-up anime portrait of a mysterious group member. Wearing iconic black cloak with red clouds, slashed headband, and intense red or purple eyes. Background: lightning-lit sky and crumbled temple in far distance, blurred.",
    },
    {
      label: "Anbu Black Ops",
      weight: 3,
      score: [70, 90] as ScoreRange,
      prompt:
        "Close-up portrait of a special ops ninja. Wearing black armor, flak vest, and a cat-style mask held at their side. Headband visible. Eyes serious and alert. Background: high rooftops at night, village skyline behind mist.",
    },
    {
      label: "Hidden Leaf teacher",
      weight: 3,
      score: [50, 70] as ScoreRange,
      prompt:
        "Anime portrait of an academy teacher. Wearing a dark tunic with scroll pouch, holding a chalk or lesson scroll. Warm, kind expression. Background: wooden training yard fence and academy windows, softly blurred.",
    },
    {
      label: "Hokage",
      weight: 2,
      score: [90, 100] as ScoreRange,
      prompt:
        "Close-up anime portrait of a village leader. Wearing the traditional white cloak with red flame trim and leader's headpiece. Calm and wise smile. Background: the monument of past leaders, softly blurred.",
    },
  ];

  let selectedRoleData = ROLES.find((r) => r.label === selectedRole);
  if (!selectedRoleData) {
    // Random selection based on weights
    const totalWeight = ROLES.reduce((sum, role) => sum + role.weight, 0);
    let random = Math.random() * totalWeight;
    for (const role of ROLES) {
      random -= role.weight;
      if (random <= 0) {
        selectedRoleData = role;
        break;
      }
    }
  }

  return {
    label: selectedRoleData?.label || "random",
    prompt: selectedRoleData?.prompt || "",
    scoreRange: selectedRoleData?.score || ([0, 100] as ScoreRange),
  };
}

function generateScores(scoreRange: ScoreRange, count: number): number[] {
  const [min, max] = scoreRange;
  return Array(count)
    .fill(0)
    .map(() => Math.floor(Math.random() * (max - min + 1)) + min);
}

export async function POST(request: Request) {
  try {
    if (!process.env.REPLICATE_API_TOKEN) {
      return NextResponse.json(
        { error: "Replicate API token not configured" },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const image = formData.get("image") as File;
    const selectedRole = formData.get("selected_role") as string;

    // Validate file
    if (!image || !image.name) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    if (!allowedFile(image.name)) {
      return NextResponse.json(
        {
          error:
            "File type not allowed. Please upload an image (PNG, JPG, JPEG, GIF)",
        },
        { status: 400 }
      );
    }

    // Check file size
    const bytes = await image.arrayBuffer();
    if (bytes.byteLength > MAX_CONTENT_LENGTH) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 16MB" },
        { status: 400 }
      );
    }

    // Get role prompt and score range
    const { label, prompt, scoreRange } = getRolePrompt(selectedRole);

    // Convert File to base64
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString("base64");
    const dataUrl = `data:${image.type};base64,${base64Image}`;

    console.log("Sending request to Replicate with prompt:", prompt);

    // Generate images using Replicate
    const output = await replicate.run(
      "bytedance/pulid:43d309c37ab4e62361e5e29b8e9e867fb2dcbcec77ae91206a8d95ac5dd451a0",
      {
        input: {
          prompt: prompt,
          main_face_image: dataUrl,
        },
      }
    );

    console.log("Replicate API response:", output);

    // Process output URLs
    let imageUrls: string[] = [];
    if (Array.isArray(output)) {
      // Handle array of ReadableStreams
      imageUrls = await Promise.all(
        output.map(async (stream) => {
          if (stream instanceof ReadableStream) {
            return await getStreamUrl(stream);
          }
          return typeof stream === "string"
            ? stream
            : (stream as ReplicateOutput).url || "";
        })
      );
    } else if (output instanceof ReadableStream) {
      // Handle single ReadableStream
      imageUrls = [await getStreamUrl(output)];
    } else {
      // Handle string or object with url
      imageUrls = [
        typeof output === "string"
          ? output
          : (output as ReplicateOutput).url || "",
      ];
    }

    console.log("Processed image URLs:", imageUrls);

    // Generate scores
    const scores = generateScores(scoreRange, imageUrls.length);

    const response = {
      image_urls: imageUrls,
      role: label,
      scores,
      prompt: prompt, // <--- Added this line!
    };

    console.log("Final response:", response);

    return NextResponse.json(response);
  } catch (err) {
    console.error("API error:", err);
    // Bubble up the error message
    return new Response(
      JSON.stringify({
        error: err instanceof Error ? err.message : String(err),
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
