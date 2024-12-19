import React from "react";
import { StyledProductCard1 } from "./ProductCardStyle";
import Rating from "../rating/Rating";
import { Link } from "react-router-dom";
import ViewInSpaceButton from "../buttons/ViewInSpaceButton";
import { ExchangeRate } from "../../types/ExchangeRate";
import { convertCurrency } from "../../utils/currencyConversion";

export interface RatingData {
  average: number;
  count: number;
  reviews: { comment: string; rating: number; user: string }[];
}

export interface ProductCard1Props {
  id: string | number;
  name?: string;
  title?: string;
  sellerPrice: number;
  sellerCurrency: string;
  buyerCurrency: string;
  buyerPrice?: number; // Optional prop
  images?: string[];
  imgUrl?: string;
  productUrl?: string;
  category?: string;
  brand?: string;
  stock?: boolean;
  rating?: number | RatingData;
  hoverEffect?: boolean;
  tryOnAvailable?: boolean;
  isArEnabled?: boolean;
  off?: number; // Optional
  discount?: number; // Add discount
  reviews?: { comment: string; rating: number; user: string }[]; // Localized reviews
  exchangeRates: ExchangeRate | null;
  onChatWithSeller?: (productId: string | number) => void;
  onTryNow?: (productId: string | number) => void;
  onClick?: () => void;
}


const ProductCard1: React.FC<ProductCard1Props> = ({
  id,
  title,
  sellerPrice,
  sellerCurrency,
  buyerCurrency,
  buyerPrice: buyerPriceProp,
  images,
  imgUrl,
  category,
  brand,
  stock,
  rating,
  hoverEffect,
  tryOnAvailable,
  isArEnabled = false,
  reviews = [],
  discount,
  exchangeRates,
  onChatWithSeller,
  onTryNow,
  onClick,
}) => {
  const primaryImage = images?.[0] || imgUrl || "/assets/images/default-product.png";

  // Calculate buyerPrice using currency conversion utility if the prop is not provided
  const calculatedBuyerPrice = buyerPriceProp
    ? buyerPriceProp
    : convertCurrency(sellerPrice, sellerCurrency, buyerCurrency, exchangeRates);

  return (
    <StyledProductCard1 hoverEffect={hoverEffect} onClick={onClick}>
      {/* Product Image */}
      <div className="image-holder">
        <Link to={`/product/${id}`}>
          <img src={primaryImage} alt={title} />
        </Link>
      </div>

      {/* Product Details */}
      <div className="details">
        <h3>{title}</h3>
        {brand && <p>Brand: {brand}</p>}
        {category && <p>Category: {category}</p>}
        {stock !== undefined && (
          <p style={{ color: stock ? "green" : "red" }}>
            {stock ? "In Stock" : "Out of Stock"}
          </p>
        )}

        {/* Rating */}
        {typeof rating === "object" && rating !== null && "average" in rating ? (
          <Rating value={(rating as RatingData).average} outof={5} color="warn" readonly />
        ) : typeof rating === "number" ? (
          <Rating value={rating} outof={5} color="warn" readonly />
        ) : null}

        {/* Seller and Buyer Price */}
        <p>
          Seller Price: {sellerCurrency} {sellerPrice.toFixed(2)}
        </p>
        <p>
          Buyer Price: {buyerCurrency} {calculatedBuyerPrice.toFixed(2)}
        </p>

        {/* Discount */}
        {discount !== undefined && discount > 0 && (
          <p style={{ color: "red", fontWeight: "bold" }}>
            Discount: {discount}% OFF
          </p>
        )}

        {/* Chat with Seller */}
        <button
          style={{ marginTop: "10px", padding: "5px 10px" }}
          onClick={() => onChatWithSeller?.(id)}
        >
          Chat with Seller
        </button>

        {/* Visual TryOn */}
        {tryOnAvailable && (
          <button
            style={{ marginTop: "10px", padding: "5px 10px" }}
            onClick={() => onTryNow?.(id)}
          >
            Try Now
          </button>
        )}

        {/* View in AR */}
        <ViewInSpaceButton productId={id} isArEnabled={isArEnabled} />

        {/* Localized Reviews */}
        {reviews.length > 0 && (
          <div style={{ marginTop: "10px" }}>
            <h4>Reviews:</h4>
            {reviews.map((review, index) => (
              <p key={index}>
                {review.user}: {review.comment} ({review.rating}/5)
              </p>
            ))}
          </div>
        )}
      </div>
    </StyledProductCard1>
  );
};

export default ProductCard1;
