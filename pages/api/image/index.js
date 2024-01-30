// pages/api/generate-image.js

import { Client } from "@octoai/client";

// Replace with your actual OctoAI token
const OCTOAI_TOKEN = process.env.NEXT_PUBLIC_OCTOAI_TOKEN;

export default async function handler(req, res) {
  try {
    const client = new Client(OCTOAI_TOKEN);
    const endpointUrl = "https://image.octoai.run/generate/sdxl";

    // Adjust inputs as needed
    const inputs = {
      prompt: "A photo of a cute cat astronaut in space",
      negative_prompt: "Blurry photo, distortion, low-res, poor quality",
      width: 1024,
      height: 1024,
      num_images: 1,
      sampler: "DDIM",
      steps: 30,
      cfg_scale: 12,
      use_refiner: true,
      high_noise_frac: 0.8,
      style_preset: "base",
    };

    const outputs = (await client.infer) < any > (endpointUrl, inputs);

    const images = outputs.images.map((output, i) => {
      const buffer = Buffer.from(output.image_b64, "base64");
      const imageData = buffer.toString("base64"); // Use base64 for API response
      return {
        filename: `result${i}.jpg`,
        imageData,
      };
    });

    res.status(200).json({ images }); // Return images as base64 data
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate image" });
  }
}
