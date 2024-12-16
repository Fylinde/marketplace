import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "redux/store";
import {
  fetchPersonalizedRecommendations,
  fetchProductRecommendations,
  fetchSearchBasedRecommendations,
  fetchAIPersonalizedRecommendations,
  fetchCrossSellingRecommendations,
  fetchUpsellingRecommendations,
} from "../../redux/slices/marketing/recommendationSlice";
import Box from "../Box";
import FlexBox from "../FlexBox";
import Typography from "../Typography";
import ProductCard1 from "../product-cards/ProductCard1";
import RecommendationService from "../../services/RecommendationService";
import type { AppDispatch } from "../../redux/store";

interface RecommendedItemsProps {
  context: "personalized" | "product" | "search" | "ai-personalized" | "cross-selling" | "upselling";
  userId?: string;
  productId?: string;
  query?: string;
}

const RecommendedItems: React.FC<RecommendedItemsProps> = ({ context, userId, productId, query }) => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    personalized,
    productBased,
    searchBased,
    aiPersonalized,
    crossSelling,
    upselling,
    loading,
  } = useSelector((state: RootState) => state.recommendation);

  const handleProductClick = (productId: string) => {
    if (userId) {
      RecommendationService.logUserInteraction({
        userId,
        productId,
        action: "click",
      });
    }
  };

  useEffect(() => {
    switch (context) {
      case "personalized":
        if (userId) {
          dispatch(fetchPersonalizedRecommendations(userId));
        }
        break;
      case "product":
        if (productId) {
          dispatch(fetchProductRecommendations(productId));
        }
        break;
      case "search":
        if (query) {
          dispatch(fetchSearchBasedRecommendations(query));
        }
        break;
      case "ai-personalized":
        if (userId) {
          dispatch(fetchAIPersonalizedRecommendations(userId));
        }
        break;
      case "cross-selling":
        if (productId) {
          dispatch(fetchCrossSellingRecommendations(productId));
        }
        break;
      case "upselling":
        if (productId) {
          dispatch(fetchUpsellingRecommendations(productId));
        }
        break;
      default:
        console.error("Unknown recommendation context:", context);
    }
  }, [context, userId, productId, query, dispatch]);

  const recommendations =
    context === "personalized"
      ? personalized
      : context === "product"
        ? productBased
        : context === "search"
          ? searchBased
          : context === "ai-personalized"
            ? aiPersonalized
            : context === "cross-selling"
              ? crossSelling
              : upselling;

  return (
    <Box>
      <Typography variant="h6" mb="1rem">
        {context === "personalized"
          ? "Recommended for You"
          : context === "product"
            ? "Similar Products"
            : context === "search"
              ? "Recommended Based on Your Search"
              : context === "ai-personalized"
                ? "AI-Powered Recommendations"
                : context === "cross-selling"
                  ? "You May Also Like"
                  : "Upselling Recommendations"}
      </Typography>

      {loading ? (
        <Typography>Loading recommendations...</Typography>
      ) : (
        <FlexBox flexWrap="wrap" gap="1rem">
          {recommendations.map((product: any) => (
            <ProductCard1
              key={product.id}
              {...product}
              onClick={() => handleProductClick(product.id)}
            />
          ))}

        </FlexBox>
      )}
    </Box>
  );
};

export default RecommendedItems;
