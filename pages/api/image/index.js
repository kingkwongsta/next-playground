import axios from "axios";

export default async function handler(req, res) {
  try {
    const endpointUrl = "https://image.octoai.run/generate/sdxl";

    // Adjust inputs as needed
    const inputs = {
      prompt: req.body.prompt,
      negative_prompt: "Blurry photo, distortion, low-res, poor quality",
      width: 1024,
      height: 1024,
      num_images: 1,
      sampler: "DDIM",
      steps: 30,
      cfg_scale: 12,
      use_refiner: true,
      high_noise_frac: 0.8,
      style_preset: "anime",
    };

    console.log(`... Sending Prompt: ${req.body.prompt}`);
    const response = await axios.post(endpointUrl, inputs, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OCTOAI_TOKEN}`,
      },
    });

    const outputs = response.data;

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
