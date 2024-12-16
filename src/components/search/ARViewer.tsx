import React, { useEffect, useRef, useState } from "react";
import ARService from "../../services/ARService";
import "aframe";
import styled from "styled-components";

// Extend the Window interface to include AFRAME
declare global {
  interface Window {
    AFRAME?: any;
  }
}

const ARContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;

  .exit-ar-button {
    position: absolute;
    top: 10px;
    right: 10px;
    background-color: #000;
    color: #fff;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    z-index: 10;
  }

  canvas {
    width: 100% !important;
    height: 100% !important;
  }
`;

const ARViewer: React.FC<{ productId: string }> = ({ productId }) => {
  const [modelUrl, setModelUrl] = useState<string | null>(null);
  const sceneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.AFRAME) {
      console.error("A-Frame library not found.");
      return;
    }

    const fetchModel = async () => {
      try {
        const data = await ARService.fetchARModel(productId);
        setModelUrl(data.modelUrl);
      } catch (error) {
        console.error("Error loading AR model:", error);
      }
    };

    fetchModel();

    // Cleanup on unmount
    return () => {
      if (sceneRef.current) {
        sceneRef.current.innerHTML = "";
      }
    };
  }, [productId]);

  if (!modelUrl) {
    return <p>Loading AR model...</p>;
  }

  return (
    <ARContainer>
      <iframe
        src={modelUrl}
        style={{ width: "100%", height: "500px", border: "none" }}
        title="AR Viewer"
      />
      <button
        className="exit-ar-button"
        onClick={() => console.log("Exiting AR mode")} // Add actual onExit logic
      >
        Exit AR
      </button>
      <a-scene
        ref={sceneRef}
        embedded
        vr-mode-ui="enabled: false"
        arjs="sourceType: webcam; debugUIEnabled: false;"
      >
        <a-light type="directional" position="0 2 1" intensity="1.5"></a-light>
        <a-light type="ambient" color="#ffffff"></a-light>
        <a-entity
          position="0 0 -3"
          scale="1 1 1"
          gltf-model={modelUrl}
          animation-mixer
        ></a-entity>
        <a-plane
          position="0 0 -4"
          rotation="-90 0 0"
          width="10"
          height="10"
          color="#cccccc"
        ></a-plane>
        <a-marker-camera preset="hiro"></a-marker-camera>
      </a-scene>
    </ARContainer>
  );
};

export default ARViewer;
