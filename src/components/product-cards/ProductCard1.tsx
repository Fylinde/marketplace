import React from "react";
import { StyledProductCard1 } from "./ProductCardStyle";
import Rating from "../rating/Rating";
import { Link } from "react-router-dom";

export interface ProductCard1Props {
  id: string | number;
  title: string;
  price: number;
  images: string[];
  imgUrl?: string; // Fallback image property
  category?: string;
  brand?: string;
  stock?: boolean;
  rating?: number;
  hoverEffect?: boolean;
  onClick?: () => void;
}

const ProductCard1: React.FC<ProductCard1Props> = ({
  id,
  title,
  price,
  images,
  imgUrl,
  category,
  brand,
  stock,
  rating,
  hoverEffect,
  onClick,
}) => {
  const primaryImage = images[0] || imgUrl || "/assets/images/default-product.png";

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
        {rating !== undefined && (
          <Rating value={rating} outof={5} color="warn" readonly />
        )}
        <p>${price.toFixed(2)}</p>
      </div>
    </StyledProductCard1>
  );
};

export default ProductCard1;
