import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const ImageSelectionApp = () => {
  const [prompts, setPrompts] = useState([]);
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [images, setImages] = useState([]);
  const [selected, setSelected] = useState(null);
  const [responses, setResponses] = useState([]);

  useEffect(() => {
    fetch("/prompts.json")
      .then((res) => res.json())
      .then((data) => setPrompts(data));

    fetch("/images.json")
      .then((res) => res.json())
      .then((data) => setImages(data));
  }, []);

  const handleSelection = (image) => {
    const newResponses = [...responses, { prompt: prompts[currentPromptIndex], selected: image }];
    setResponses(newResponses);
    setSelected(image);
    
    setTimeout(() => {
      setSelected(null);
      setCurrentPromptIndex((prev) => prev + 1);
    }, 500);
  };

  useEffect(() => {
    if (responses.length === prompts.length && responses.length > 0) {
      fetch("/save_responses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(responses),
      });
    }
  }, [responses]);

  if (currentPromptIndex >= prompts.length || images.length === 0) {
    return <div className="text-center p-4">All selections completed. Thank you!</div>;
  }

  const currentPrompt = prompts[currentPromptIndex];
  const currentImages = images[currentPromptIndex] || [];

  return (
    <div className="flex flex-col items-center p-4">
      <h2 className="text-xl mb-4">{currentPrompt}</h2>
      <div className="flex gap-4">
        {currentImages.map((img, idx) => (
          <div key={idx} className={selected === img ? "border-4 border-blue-500" : ""}>
            <img src={img} alt="option" className="w-64 h-64 object-cover cursor-pointer" onClick={() => handleSelection(img)} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageSelectionApp;
