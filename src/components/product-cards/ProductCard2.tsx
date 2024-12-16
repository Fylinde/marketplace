import React from "react";
import HoverBox from "components/HoverBox";
import LazyImage from "components/LazyImage";
import { H4 } from "components/Typography";
import { Link } from "react-router-dom";
import ViewInSpaceButton from "../buttons/ViewInSpaceButton";


export interface ProductCard2Props {
  id?: string | number;
  imgUrl?: string;
  title?: string;
  sellerPrice?: number;
  buyerPrice?: number;
  sellerCurrency?: string;
  buyerCurrency?: string;
  productUrl: string;
  onChatWithSeller?: () => void; // Chat with seller handler
  onTryNow?: () => void; // Visual TryOn handler
  tryOnAvailable?: boolean; // Visual TryOn availability
  isArEnabled?: boolean;
}

const ProductCard2: React.FC<ProductCard2Props> = ({
  id,
  imgUrl = "/assets/images/default-product.png",
  title = "Product Title",
  sellerPrice = 0,
  buyerPrice = 0,
  sellerCurrency = "USD",
  buyerCurrency = "USD",
  productUrl,
  onChatWithSeller,
  onTryNow,
  tryOnAvailable,
  isArEnabled = false,
}) => {
  return (
    <Link to={productUrl} style={{ textDecoration: "none", color: "inherit" }}>
      {/* Product Image */}
      <HoverBox borderRadius={8} mb="0.5rem">
        <LazyImage
          src={imgUrl}
          style={{ width: "100%", height: "auto", borderRadius: "4px" }}
          alt={title}
        />
      </HoverBox>

      {/* Product Title */}
      <H4 fontWeight="600" fontSize="14px" mb="0.25rem">
        {title}
      </H4>

      {/* Multi-Currency Prices */}
      <H4 fontWeight="600" fontSize="14px" color="primary.main" mb="0.25rem">
        {buyerCurrency} {Math.ceil(buyerPrice).toLocaleString()}
      </H4>
      <H4 fontWeight="500" fontSize="12px" color="text.muted">
        {sellerCurrency} {Math.ceil(sellerPrice).toLocaleString()}
      </H4>

      {/* Chat with Seller */}
      <button
        style={{ marginTop: "10px", padding: "5px 10px" }}
        onClick={(e) => {
          e.preventDefault(); // Prevent navigation
          onChatWithSeller?.();
        }}
      >
        Chat with Seller
      </button>

      {/* Visual TryOn */}
      {tryOnAvailable && (
        <button
          style={{ marginTop: "10px", padding: "5px 10px" }}
          onClick={(e) => {
            e.preventDefault(); // Prevent navigation
            onTryNow?.();
          }}
        >
          Try Now
        </button>
      )}

    {/* View in AR */}
    <ViewInSpaceButton productId={id} isArEnabled={isArEnabled} />

    </Link>
  );
};

export default ProductCard2;
