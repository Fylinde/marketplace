import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductsByTag } from "../../redux/slices/products/productSlice";
import type { AppDispatch, RootState } from "@/redux/store";
import CategorySectionCreator from "../CategorySectionCreator";
import ProductCard1 from "../product-cards/ProductCard1";
import Carousel from "../carousel/Carousel";
import Box from "../../components/Box";

const Section2: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const flashDeals = useSelector(
    (state: RootState) => state.products.productsByTag["flash-deal"] || []
  );
  const loading = useSelector(
    (state: RootState) => state.products.loadingProductsByTag["flash-deal"] || false
  );
  const error = useSelector((state: RootState) => state.products.error);

  // Fetch flash deals with fallback behavior
  useEffect(() => {
    if (flashDeals.length === 0) {
      dispatch(fetchProductsByTag({ tag: "flash-deal" }));
    }
  }, [dispatch, flashDeals.length]);

  return (
    <CategorySectionCreator iconName="light" title="Flash Deals" seeMoreLink="#">
      <Box mt="1.5rem" mb="1.5rem">
        {loading ? (
          <p>Loading Flash Deals...</p>
        ) : flashDeals.length > 0 ? (
          <Carousel totalSlides={flashDeals.length} visibleSlides={4}>
            {flashDeals.map((product) => (
              <ProductCard1
                  key={product.id}
                  id={product.id}
                  imgUrl={product.imgUrl || "/assets/images/default-product.png"}
                  title={product.name || "Untitled Product"}
                  sellerPrice={product.sellerPrice || 0}
                  buyerPrice={product.buyerPrice || 0}
                  sellerCurrency={product.sellerCurrency || "USD"}
                  buyerCurrency={product.buyerCurrency || "USD"}
                  exchangeRates={product.exchangeRates || { baseCurrency: "USD", rates: {} }} // Provide default exchange rates
                />

            ))}
          </Carousel>
        ) : (
          <p>No Flash Deals Available</p>
        )}
      </Box>
    </CategorySectionCreator>
  );
};

export default Section2;
