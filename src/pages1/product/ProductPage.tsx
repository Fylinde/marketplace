import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  fetchProductDetails,
  fetchLocalizedPrices,
  fetchTryOnData,
  fetchRelatedProducts,
} from "@/redux/slices/products/productSlice";
import ProductReviews from "@/components/product/ProductReviews";
import RelatedProducts from "@/components/product/RelatedProducts";
import ProductTryOn from "@/components/product/TryOnWidget";
import Chatbot from "@/components/chatbot/Chatbot";
import SellerChat from "@/components/sellerChat/SellerChat";
import ProductPageHelmet from "@/components/product/ProductPageHelmet";
import ProductSchema from "@/components/product/ProductSchema";
import styled from "styled-components";
import { LazyLoadImage } from "react-lazy-load-image-component";
import type { AppDispatch } from "../../redux/store";

const ProductPage: React.FC<{ productId: string; buyerCurrency: string; language: string }> = ({
  productId,
  buyerCurrency,
  language,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { currentProduct, localizedPrices, loading, error } = useSelector(
    (state: RootState) => state.products
  );

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([
        dispatch(fetchProductDetails(productId)),
        dispatch(fetchLocalizedPrices({ productId, buyerCurrency })),
        dispatch(fetchTryOnData(productId)),
        dispatch(fetchRelatedProducts({ productId })),
      ]);
    };
    fetchData();
  }, [dispatch, productId, buyerCurrency]);

  if (loading) return <PageContainer>Loading product details...</PageContainer>;
  if (error) return <PageContainer>Error: {error}</PageContainer>;
  if (!currentProduct) return <PageContainer>Product not found</PageContainer>;

  const buyerPrice = localizedPrices[productId]?.buyerPrice || currentProduct.price;
  const sellerPrice = localizedPrices[productId]?.sellerPrice || currentProduct.price;

  return (
    <PageContainer>
      <ProductPageHelmet
        title={currentProduct.name}
        description={currentProduct.description || "No description available"}
      />
      <ProductSchema product={currentProduct} />

      <ProductSection>
        <ImageContainer>
          <LazyLoadImage src={currentProduct.imgUrl} alt={currentProduct.name} effect="blur" />
        </ImageContainer>
        <DetailsContainer>
          <h1>{currentProduct.name}</h1>
          <LocalizedPrice>
            <p>
              Seller Price: <span>${sellerPrice}</span>
            </p>
            <p>
              Your Price ({buyerCurrency}):{" "}
              <span>{buyerPrice.toFixed(2)} {buyerCurrency}</span>
            </p>
          </LocalizedPrice>
          <p>{currentProduct.description}</p>
          <AddToCart>
            <button>Add to Cart</button>
            <button>Add to Wishlist</button>
            <button>Share</button>
          </AddToCart>
          <StockInfo stock={currentProduct.stock ?? 0}>
            {currentProduct.stock !== undefined && currentProduct.stock > 0
              ? `In Stock (${currentProduct.stock} available)`
              : "Out of Stock"}
          </StockInfo>
          {currentProduct.tryOnAvailable && <ProductTryOn productId={productId} />}
        </DetailsContainer>
      </ProductSection>

      <ReviewsSection>
        <ProductReviews productId={productId} />
      </ReviewsSection>

      <ChatSection>
        <Chatbot sessionId={productId} language={language} />
        <SellerChat chatId={productId} />
      </ChatSection>

      <RelatedSection>
        <h2>Related Products</h2>
        <RelatedProducts productId={productId} />
      </RelatedSection>
    </PageContainer>
  );
};

export default ProductPage;

// styles

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
  padding: 20px;
  background-color: #f5f5f5;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const ProductSection = styled.div`
  display: flex;
  gap: 20px;
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ImageContainer = styled.div`
  flex: 1;

  img {
    width: 100%;
    height: auto;
    border-radius: 8px;
  }
`;

const DetailsContainer = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: 20px;

  h1 {
    font-size: 2rem;
    color: #333;
  }

  p {
    font-size: 1rem;
    color: #555;
  }
`;

const LocalizedPrice = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;

  p {
    font-size: 1.2rem;
    color: #333;

    span {
      font-weight: bold;
      color: #007bff;
    }
  }
`;

const AddToCart = styled.div`
  display: flex;
  gap: 10px;

  button {
    padding: 10px 20px;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
      background-color: #0056b3;
    }
  }
`;

// Styled components remain the same except for StockInfo
interface StockInfoProps {
  stock: number;
}

const StockInfo = styled.div<StockInfoProps>`
    font-size: 1rem;
    color: ${(props) => (props.stock > 0 ? "#4caf50" : "#ff5252")};
  `;

const ReviewsSection = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
`;

const ChatSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const RelatedSection = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;

  h2 {
    font-size: 1.5rem;
    margin-bottom: 20px;
  }
`;
