import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProductDetails,
  fetchLocalizedPrices,
  fetchRelatedProducts,
} from "../../redux/slices/products/productSlice";
import { fetchTryOnData } from "../../redux/slices/utils/tryOnSlice";
import { fetchCurrentExchangeRates } from "../../redux/slices/utils/exchangeRateSlice";
import ExchangeRateCard from "../../components/exchange/ExchangeRateCard";
import CurrencyConverter from "../../components/exchange/CurrencyConverter";
import ProductReviews from "../../components/product/ProductReviews";
import RelatedProducts from "../../components/product/RelatedProducts";
import ProductTryOn from "../../components/product/TryOnWidget";
import Chatbot from "../../components/chatbot/Chatbot";
import SellerChat from "../../components/sellerChat/SellerChat";
import ProductPageHelmet from "../../components/product/ProductPageHelmet";
import ProductSchema from "../../components/product/ProductSchema";
import styled from "styled-components";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { getLocalizedText } from "../../utils/localizationUtils";
import type { AppDispatch, RootState  } from "../../redux/store";

const ProductPage: React.FC<{ productId: string; buyerCurrency: string; language: string }> = ({
  productId,
  buyerCurrency,
  language,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { currentProduct, localizedPrices, loading, error } = useSelector(
    (state: RootState) => state.products
  );

  // Fetch rates and baseCurrency from exchangeRate slice
  const { rates, baseCurrency } = useSelector((state: RootState) => state.exchangeRate);

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([
        dispatch(fetchProductDetails(productId)),
        dispatch(fetchLocalizedPrices({ productId, buyerCurrency })),
        dispatch(fetchTryOnData(productId)),
      //  dispatch(fetchRelatedProducts({ productId })),
        dispatch(fetchCurrentExchangeRates()), // Fetch exchange rates
      ]);
    };
    fetchData();
  }, [dispatch, productId, buyerCurrency]);

  if (loading) return <PageContainer>{getLocalizedText("loading", "product")}</PageContainer>;
  if (error) return <PageContainer>{getLocalizedText(error, "product")}</PageContainer>;
  if (!currentProduct) return <PageContainer>{getLocalizedText("productNotFound", "product")}</PageContainer>;

  const buyerPrice = localizedPrices[productId]?.buyerPrice || currentProduct.price;
  const sellerPrice = localizedPrices[productId]?.sellerPrice || currentProduct.price;

  return (
    <PageContainer>
      <ProductPageHelmet
        title={currentProduct.name}
        description={currentProduct.description || getLocalizedText("noDescription", "product")}
      />
      <ProductSchema product={currentProduct} />

      {/* Product Section */}
      <ProductSection>
        <ImageContainer>
          <LazyLoadImage src={currentProduct.imgUrl} alt={currentProduct.name} effect="blur" />
        </ImageContainer>
        <DetailsContainer>
          <h1>{currentProduct.name}</h1>
          <LocalizedPrice>
            <p>
              {getLocalizedText("sellerPrice", "product")}: <span>${sellerPrice}</span>
            </p>
            <p>
              {getLocalizedText("yourPrice", "product")} ({buyerCurrency}):
              <span>
                {buyerPrice.toFixed(2)} {buyerCurrency}
              </span>
            </p>
          </LocalizedPrice>
          <CurrencyConverter rates={rates} baseCurrency={baseCurrency} /> {/* Pass rates and baseCurrency */}
          <p>{currentProduct.description}</p>
          <AddToCart>
            <button>{getLocalizedText("addToCart", "product")}</button>
            <button>{getLocalizedText("addToWishlist", "product")}</button>
            <button>{getLocalizedText("share", "product")}</button>
          </AddToCart>
          <StockInfo stock={currentProduct.stock ?? 0}>
            {currentProduct.stock !== undefined && currentProduct.stock > 0
              ? `${getLocalizedText("inStock", "product")} (${currentProduct.stock} ${getLocalizedText("available", "product")})`
              : getLocalizedText("outOfStock", "product")}
          </StockInfo>
          {currentProduct.tryOnAvailable && <ProductTryOn productId={productId} />}
        </DetailsContainer>
      </ProductSection>

      {/* Exchange Rate Widget */}
      <ExchangeRateWidget>
        <ExchangeRateCard rates={rates} baseCurrency={baseCurrency} /> {/* Pass props */}
      </ExchangeRateWidget>

      {/* Reviews Section */}
      <ReviewsSection>
        <ProductReviews productId={productId} />
      </ReviewsSection>

      {/* Chat Section */}
      <ChatSection>
        <Chatbot sessionId={productId} />
        <SellerChat chatId={productId} />
      </ChatSection>

      {/* Related Products Section */}
      <RelatedSection>
        <h2>{getLocalizedText("relatedProducts", "product")}</h2>
        <RelatedProducts productId={productId} />
      </RelatedSection>
    </PageContainer>
  );
};

export default ProductPage;

// Styled Components

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

const StockInfo = styled.div<{ stock: number }>`
  font-size: 1rem;
  color: ${(props) => (props.stock > 0 ? "#4caf50" : "#ff5252")};
`;

const ExchangeRateWidget = styled.div`
  margin-top: 20px;
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
