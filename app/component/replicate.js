"use client";
import { useState } from "react";
import Image from "next/image";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export default function Replicate() {
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("submit clicked");
    const response = await fetch("/api/predictions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: e.target.prompt.value,
      }),
    });
    let prediction = await response.json();
    if (response.status !== 201) {
      setError(prediction.detail);
      return;
    }
    setPrediction(prediction);

    while (
      prediction.status !== "succeeded" &&
      prediction.status !== "failed"
    ) {
      await sleep(1000);
      const response = await fetch("/api/predictions/" + prediction.id);
      prediction = await response.json();
      if (response.status !== 200) {
        setError(prediction.detail);
        return;
      }
      console.log({ prediction });
      setPrediction(prediction);
    }
  };

  return (
    <div className="space-y-5">
      <h2>Replicate + Next.js</h2>
      <p>
        Dream something with{" "}
        <a href="https://replicate.com/stability-ai/stable-diffusion">SDXL</a>:
      </p>
      <form className="space-x-8" onSubmit={handleSubmit}>
        <textarea
          className="border-slate-800 border-2 min-h-[200px] min-w-[500px] p-4 break-words"
          type="text"
          name="prompt"
          placeholder="Enter a prompt to display an image"
        />
        <button className="border-2 border-slate-700 p-4" type="submit">
          Go!
        </button>
      </form>

      {error && <div>{error}</div>}

      {prediction && (
        <div>
          {prediction.output && (
            <div className="">
              <Image
                src={prediction.output[prediction.output.length - 1]}
                alt="output"
                width={500}
                height={500}
              />
            </div>
          )}
          <p>status: {prediction.status}</p>
        </div>
      )}
    </div>
  );
}
