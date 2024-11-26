import React, { useRef, useEffect } from "react";

interface ModelViewerProps {
  src: string;
  alt: string;
  style?: React.CSSProperties;
  autoRotate?: boolean;
  cameraControls?: boolean;
}

const ModelViewer: React.FC<ModelViewerProps> = ({
  src,
  alt,
  style = { width: "100%", height: "400px" },
  autoRotate = false,
  cameraControls = false,
}) => {
  const ref = useRef<HTMLElement | null>(null);

  const handleError = () => {
    console.error("Failed to load model.");
    // Render a fallback (e.g., a placeholder image or error message)
  };
    
  useEffect(() => {
    if (!ref.current) {
      console.warn("model-viewer element not initialized.");
    }
  }, []);

  return React.createElement("model-viewer", {
    ref,
    src,
    alt,
    style,
    "auto-rotate": autoRotate,
    "camera-controls": cameraControls,
    onError: handleError, // Handle errors gracefully
  });
};

export default ModelViewer;
