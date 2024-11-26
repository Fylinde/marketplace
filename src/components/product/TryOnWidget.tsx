import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTryOnData } from "@/redux/slices/productSlice";
import { RootState } from "@/redux/store";
import type { AppDispatch } from "../../redux/store"; 
import ProductTryOnContainer from "./styles/ProductTryOn.styles";


const ProductTryOn: React.FC<{ productId: string }> = ({ productId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { tryOnData } = useSelector((state: RootState) => state.products);

  useEffect(() => {
    dispatch(fetchTryOnData(productId));
  }, [dispatch  , productId]);

  const tryOn = tryOnData[productId];

  if (!tryOn) return <div>Loading try-on data...</div>;

  return (
    <ProductTryOnContainer>
      <h3>Try On This Product</h3>
      {/* Display try-on data, assuming it's an image or interactive feature */}
      {tryOn.type === "image" && <img src={tryOn.url} alt="Try On" />}
      {tryOn.type === "interactive" && (
        <iframe src={tryOn.url} title="Try On Feature" style={{ width: "100%", height: "400px" }} />
      )}
    </ProductTryOnContainer>
  );
};

export default ProductTryOn;

