import axios from "axios";

export default async function handler(req, res) {
  try {
    const endpointUrl = "https://image.octoai.run/generate/sdxl";

    // Adjust inputs as needed
    const modifiedPrompt = `In the center of the bar, illuminated by a spotlight emanating from the ceiling, sits a masterpiece of cocktail. A crystal coupe glass cradles a cocktail containing gin, lemon juice, simple syrup, orange bitters, and egg white. A liquor bottle of gin next to cocktail.Utilizing photorealistic and hyper-detailed style to capture the rich textures and vibrant colors of the scene. Additionally emphasize the interplay of light and shadow, creating a sense of drama and intrigue.`;
    const inputs = {
      prompt: modifiedPrompt,
      negative_prompt:
        "Blurry photo, distortion, low-res, poor quality, multiple cocktail glasses",
      width: 1024,
      height: 1024,
      num_images: 1,
      sampler: "DDIM",
      steps: 30,
      cfg_scale: 12,
      use_refiner: true,
      high_noise_frac: 0.8,
      style_preset: "Watercolor",
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
