import React from "react";
import { StyledProductCard1 } from "./ProductCardStyle";
import Rating from "../rating/Rating";
import { Link } from "react-router-dom";
import ViewInSpaceButton from "../buttons/ViewInSpaceButton";
import { ExchangeRate } from "../../types/ExchangeRate";
import { convertCurrency } from "../../utils/currencyConversion";
import Button from "../buttons/Button";

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
  buyerPrice?: number;
  images?: string[];
  imgUrl?: string;
  productUrl?: string;
  category?: string;
  brand?: string;
  stock?: boolean;
  rating?: number | { average: number; count: number; reviews: any[] };
  hoverEffect?: boolean;
  tryOnAvailable?: boolean;
  isArEnabled?: boolean;
  off?: number;
  discount?: number;
  reviews?: { comment: string; rating: number; user: string }[];
  exchangeRates: { baseCurrency: string; rates: Record<string, number> };
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

  const calculatedBuyerPrice = buyerPriceProp
    ? buyerPriceProp
    : convertCurrency(sellerPrice, sellerCurrency, buyerCurrency, exchangeRates);

  return (
    <StyledProductCard1 hoverEffect={hoverEffect} onClick={onClick}>
      <div className="image-holder">
        <Link to={`/product/${id}`}>
          <img src={primaryImage} alt={title} />
        </Link>
      </div>

      <div className="details">
        <h3>{title}</h3>
        {brand && <p>Brand: {brand}</p>}
        {category && <p>Category: {category}</p>}
        {stock !== undefined && (
          <p style={{ color: stock ? "green" : "red" }}>
            {stock ? "In Stock" : "Out of Stock"}
          </p>
        )}

        {rating && typeof rating === "object" && "average" in rating ? (
          <Rating value={rating.average} outof={5} color="warn" readonly />
        ) : typeof rating === "number" ? (
          <Rating value={rating} outof={5} color="warn" readonly />
        ) : null}

        <p>
          Seller Price: {sellerCurrency} {sellerPrice.toFixed(2)}
        </p>
        <p>
          Buyer Price: {buyerCurrency} {calculatedBuyerPrice.toFixed(2)}
        </p>

        {discount !== undefined && discount > 0 && (
          <p style={{ color: "red", fontWeight: "bold" }}>
            Discount: {discount}% OFF
          </p>
        )}

        <button
          style={{ marginTop: "10px", padding: "5px 10px" }}
          onClick={() => onChatWithSeller?.(id)}
        >
          Chat with Seller
        </button>

        {tryOnAvailable && (
          <button
            style={{ marginTop: "10px", padding: "5px 10px" }}
            onClick={() => onTryNow?.(id)}
          >
            Try Now
          </button>
        )}

        <ViewInSpaceButton productId={id} isArEnabled={isArEnabled} />

        {reviews.length > 0 && (
          <div style={{ marginTop: "10px" }}>
            <h4>Reviews:</h4>
            {reviews.map((review, index) => (
              <p key={index}>
                {review.user || "Anonymous"}: {review.comment} ({review.rating}/5)
              </p>
            ))}
          </div>
        )}
      </div>
    </StyledProductCard1>
  );
};

export default React.memo(ProductCard1);