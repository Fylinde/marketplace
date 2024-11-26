import React, { useEffect, useState } from "react";
import styled from "styled-components";
import ModelViewer from "../modelViewer/ModelViewer";

interface TryOnProps {
  productId: number;
  fetchAsset: (productId: number) => Promise<string>;
}

const TryOn: React.FC<TryOnProps> = ({ productId, fetchAsset }) => {
  const [assetUrl, setAssetUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const asset = await fetchAsset(productId);
        setAssetUrl(asset);
      } catch (error: any) {
        setError(error.message || "Failed to load Try-On asset.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [productId, fetchAsset]);

  if (loading) {
    return <Loader>Loading Try-On...</Loader>;
  }

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }

  return (
    <TryOnContainer>
      <h3>Virtual Try-On</h3>
      {assetUrl && assetUrl.endsWith(".glb") ? (
        <ModelViewer
          src={assetUrl}
          alt="3D Model"
          autoRotate
          cameraControls
          style={{ width: "100%", height: "400px" }}
        />
      ) : (
        assetUrl && (
          <img
            src={assetUrl}
            alt="Try-On Asset"
            style={{ maxWidth: "100%", borderRadius: "8px" }}
          />
        )
      )}
    </TryOnContainer>
  );
};

export default TryOn;

// Styled Components
const TryOnContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #fff;

  h3 {
    font-size: 1.5rem;
    color: #333;
  }
`;

const Loader = styled.div`
  font-size: 1.2rem;
  color: #555;
  text-align: center;
  padding: 20px;
`;

const ErrorMessage = styled.div`
  font-size: 1.2rem;
  color: red;
  text-align: center;
  padding: 20px;
  border: 1px solid red;
  border-radius: 8px;
`;
