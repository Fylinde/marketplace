import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProductDetails,
  fetchPersonalizedRecommendations,
  fetchCommunityQuestions,
} from "../../redux/slices/products/productCardSlice";
import { WebSocketService } from "../../services/websocketService";
import Countdown from "react-countdown";
import Rating from "../rating/Rating";
import Button from "../buttons/Button";
import Icon from "../icon/Icon";
import { LazyLoadImage } from "react-lazy-load-image-component";
import styled from "styled-components";
import { Link } from "react-router-dom";
import type { AppDispatch, RootState } from "../../redux/store";
import { Product } from "../../types/Product";

// WebSocket Service Initialization
const webSocketService = new WebSocketService('ws://mock-server', true);

// Styled Components
const ProductCardContainer = styled.div`
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin: 16px;
  max-width: 400px;
  width: 100%;
  transition: transform 0.3s ease-in-out;

  &:hover {
    transform: scale(1.03);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }

  @media (max-width: 768px) {
    max-width: 100%;
    margin: 8px;
  }
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  padding-top: 56.25%; /* 16:9 Aspect Ratio */
  background: #f9f9f9;

  .sale-chip {
    position: absolute;
    top: 8px;
    left: 8px;
    background: #ff5252;
    color: white;
    font-size: 12px;
    padding: 4px 8px;
    border-radius: 4px;
  }

  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const Details = styled.div`
  padding: 16px;

  h3 {
    font-size: 18px;
    margin: 0 0 8px;
    color: #333;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }

  .price-section {
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    h4 {
      font-size: 20px;
      color: #ff5252;
    }

    del {
      font-size: 14px;
      color: #999;
    }

    .seller-price {
      font-size: 14px;
      color: #555;
      margin-top: 4px;
    }
  }

  .additional-info {
    margin-top: 8px;

    p {
      font-size: 14px;
      color: #555;
    }
  }
`;

const StockInfo = styled.div<{ outOfStock: boolean }>`
  color: ${(props) => (props.outOfStock ? "#ff5252" : "#4caf50")};
`;

const CartActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;

  button {
    flex: 1;
    margin: 0 4px;
  }
`;

const Recommendations = styled.div`
  margin-top: 16px;

  h4 {
    font-size: 16px;
    color: #333;
    margin-bottom: 8px;
  }

  .recommendation-list {
    display: flex;
    overflow-x: auto;

    .recommendation-item {
      flex: 0 0 100px;
      text-align: center;
      margin-right: 8px;

      img {
        width: 100%;
        height: auto;
        border-radius: 4px;
      }

      p {
        font-size: 12px;
        margin: 4px 0;
        color: #333;
      }
    }
  }
`;

const CommunityQuestions = styled.div`
  margin-top: 16px;

  h4 {
    font-size: 16px;
    color: #333;
    margin-bottom: 8px;
  }

  .question {
    margin-bottom: 8px;
    font-size: 14px;

    p {
      margin: 0;
      color: #555;
    }

    strong {
      color: #333;
    }
  }
`;

const TrendingStats = styled.div`
  margin-top: 16px;
  font-size: 14px;

  p {
    margin: 4px 0;
    color: #333;
  }
`;

// Props Interface
interface EnhancedProductCardProps {
  productId: string; // Standardized to string
  buyerRegion: string;
  buyerCurrency: string;
  sellerPrice: number;
  sellerCurrency: string;
  localizedPrices?: Record<string, { buyerPrice: number; sellerPrice: number; sellerCurrency: string }>;
  stock?: number;
  recommendations?: any[];
  communityQuestions?: Record<string, any[]>;
  trendingStats?: Record<string, { views: number; purchases: number }>;
  tryOnAvailable?: boolean;
  onAddToCart?: (productId: string) => void;
  onOpenChatWithSeller?: (productId: string) => void;
}

// EnhancedProductCard Component
const EnhancedProductCard: React.FC<EnhancedProductCardProps> = ({
  productId,
  buyerRegion,
  buyerCurrency,
  sellerPrice,
  sellerCurrency,
  localizedPrices = {},
  stock = 0,
  recommendations = [],
  communityQuestions = {},
  trendingStats = {},
  tryOnAvailable = false,
  onAddToCart = () => { },
  onOpenChatWithSeller = () => { },
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [liveData, setLiveData] = useState<{
    buyerPrice?: number;
    sellerPrice?: number;
    saleEndsIn?: number;
  }>({});

  const {
    products,
    loading,
    error,
  } = useSelector((state: RootState) => state.productCard);

  const product = products.find((p) => p.id === productId);

  useEffect(() => {
    dispatch(
      fetchProductDetails({
        productId,
        buyerCurrency,
      })
    );
    dispatch(fetchPersonalizedRecommendations({ buyerId: "user123", region: buyerRegion }));
    dispatch(fetchCommunityQuestions(productId));

    webSocketService.subscribe(`/products/${productId}`, (data) => setLiveData(data));

    return () => {
      webSocketService.unsubscribe(`/products/${productId}`);
    };
  }, [dispatch, productId, buyerRegion]);

  if (!product) return <div>Product not found</div>;
  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  const { name, imgUrl, price, discount, rating, brand, category } = product;
  const discountedPrice = price - (price * discount) / 100;

  return (
    <ProductCardContainer>
      <ImageContainer>
        <Link to={`/product/${productId}`}>
          <LazyLoadImage src={imgUrl} alt={name} effect="blur" />
        </Link>
        {discount > 0 && <div className="sale-chip">{discount}% Off</div>}
      </ImageContainer>

      <Details>
        <h3>{name}</h3>
        {brand && <p className="additional-info">Brand: {brand}</p>}
        {category && <p className="additional-info">Category: {category}</p>}
        <Rating value={Number(rating) || 0} outof={5} readonly />
        <div className="price-section">
          <h4>
            {liveData.buyerPrice || localizedPrices[productId]?.buyerPrice || sellerPrice} {buyerCurrency}
          </h4>
          {discount > 0 && (
            <del>
              {liveData.sellerPrice || localizedPrices[productId]?.sellerPrice || sellerPrice} {sellerCurrency}
            </del>
          )}
          <p className="seller-price">
            Seller Price: {sellerPrice} {sellerCurrency}
          </p>
        </div>
        {liveData.saleEndsIn && (
          <Countdown
            date={Date.now() + liveData.saleEndsIn * 1000}
            renderer={({ hours, minutes, seconds }) => (
              <div className="dynamic-price">
                Sale ends in: {hours}:{minutes}:{seconds}
              </div>
            )}
          />
        )}

        <StockInfo outOfStock={stock === 0}>
          {stock > 0 ? `Stock: ${stock}` : "Out of Stock"}
        </StockInfo>

        {tryOnAvailable && <p className="additional-info">Try-On Available</p>}

        <CartActions>
          <Button variant="outlined" color="primary" onClick={() => onAddToCart(productId)}>
            Add to Cart
          </Button>
          <Icon className="wishlist-icon" variant="small">
            heart
          </Icon>
          <Button variant="text" color="secondary" onClick={() => onOpenChatWithSeller(productId)}>
            Chat with Seller
          </Button>
        </CartActions>
      </Details>

      <Recommendations>
        <h4>Recommended for You</h4>
        <div className="recommendation-list">
          {recommendations.map((rec, index) => (
            <div key={index} className="recommendation-item">
              <LazyLoadImage src={rec.imgUrl} alt={rec.name} />
              <p>{rec.name}</p>
              <p>
                {rec.price} {buyerCurrency}
              </p>
            </div>
          ))}
        </div>
      </Recommendations>

      <CommunityQuestions>
        <h4>Questions & Answers</h4>
        {communityQuestions[productId]?.map((q, index) => (
          <div key={index} className="question">
            <p>
              <strong>Q:</strong> {q.question}
            </p>
            <p>
              <strong>A:</strong> {q.answer || "No answer yet"}
            </p>
          </div>
        ))}
      </CommunityQuestions>

      <TrendingStats>
        <p>Views: {trendingStats[productId]?.views || 0}</p>
        <p>Purchases: {trendingStats[productId]?.purchases || 0}</p>
      </TrendingStats>

      <footer className="footer">
        <p>
          Prices shown in <strong>{buyerCurrency}</strong> and converted from seller's price in{" "}
          <strong>{localizedPrices[productId]?.sellerCurrency || sellerCurrency || "unknown currency"}</strong>.
        </p>
      </footer>
    </ProductCardContainer>
  );
};

export default EnhancedProductCard;

// Open chat function
const openChatWithSeller = (productId: string) => {
  // Placeholder: Implement logic to open chat window with seller
  console.log(`Opening chat with seller for product ID: ${productId}`);
};
