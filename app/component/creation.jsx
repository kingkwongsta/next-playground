"use client";
import { useState } from "react";
import Image from "next/image";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export default function Creation() {
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("submit clicked");

    try {
      const response = await fetch("/api/image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: e.target.prompt.value,
        }),
      });

      if (!response.ok) {
        const errorMessage = await response.json();
        setError(errorMessage.error);
        return;
      }

      const { images } = await response.json();

      // Assuming there is only one image in the response
      const imageURL = `data:image/jpeg;base64,${images[0].imageData}`;
      setPrediction({ imageURL });
    } catch (error) {
      console.error(error);
      setError("Failed to generate image");
    }
  };

  return (
    <div className="space-y-5">
      <h2>OctoAI + Next.js</h2>
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

      <div>
        <h2>Debug</h2>
        {prediction && <h3>Data Recieved</h3>}
        <button
          onClick={() => console.log(prediction)}
          className="border-2 border-sky-800"
        >
          GET ME THE DATA
        </button>
      </div>

      {prediction && (
        <div className="">
          <Image
            src={prediction.imageURL}
            alt="output"
            width={1000}
            height={1000}
          />
        </div>
      )}
      {/* {error && <div>{error}</div>}

      {prediction && (
        <div>
          {prediction.output && (
            <div className="">
              <Image
                src={prediction.output[prediction.output.length - 1]}
                alt="output"
                width={1000}
                height={1000}
              />
            </div>
          )}
          <p>status: {prediction.status}</p>
        </div>
      )}*/}
    </div>
  );
}
