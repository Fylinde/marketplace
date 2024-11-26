import React, { useEffect, useRef } from "react";

const TestModelViewer: React.FC = () => {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!ref.current) {
      console.error("Failed to load model-viewer");
    }
  }, []);

  return React.createElement("model-viewer", {
    ref,
    src: "https://modelviewer.dev/shared-assets/models/Astronaut.glb",
    alt: "3D Model",
    "auto-rotate": true,
    "camera-controls": true,
    style: { width: "100%", height: "400px" },
  });
};

export default TestModelViewer;
