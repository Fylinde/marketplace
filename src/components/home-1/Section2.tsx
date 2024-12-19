import React, { useEffect, useState } from "react";
import Box from "components/Box";
import useWindowSize from "../../hooks/useWindowSize";
import Carousel from "../carousel/Carousel";
import CategorySectionCreator from "../CategorySectionCreator";
import ProductCard1 from "../product-cards/ProductCard1";
import { useDispatch, useSelector } from "react-redux";
import { fetchFlashDeals } from "../../redux/slices/products/productSlice";
import { RootState } from "redux/store";
import type { AppDispatch } from "../../redux/store";
import { Product } from "types/Product";
import { convertCurrency } from "../../utils/currencyConversion";

const Section2: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { products, loading, error } = useSelector((state: RootState) => state.products);
  const { currentRates } = useSelector((state: RootState) => state.exchangeRate); // Fetch exchange rates

  // Filter flash deals from products
  const flashDeals = products.filter((product: Product) => product.tag === "flash-deal");

  const [visibleSlides, setVisibleSlides] = useState(4);
  const { width } = useWindowSize(); // Extract the window width using custom hook

  useEffect(() => {
    if (width !== null) {
      if (width < 500) setVisibleSlides(1);
      else if (width < 650) setVisibleSlides(2);
      else if (width < 950) setVisibleSlides(3);
      else setVisibleSlides(4);
    }
  }, [width]);

  useEffect(() => {
    if (!products.length) {
      dispatch(fetchFlashDeals());
    }
  }, [dispatch, products.length]);

  return (
    <CategorySectionCreator iconName="light" title="Flash Deals" seeMoreLink="#">
      <Box mt="-0.25rem" mb="-0.25rem">
        {loading ? (
          <p>Loading Flash Deals...</p>
        ) : error ? (
          <p>Error loading Flash Deals: {error}</p>
        ) : (
          <Carousel totalSlides={flashDeals.length} visibleSlides={visibleSlides}>
            {flashDeals.map((item: Product, ind: number) => {
              const buyerPrice = currentRates
                ? convertCurrency(
                    item.sellerPrice || item.price || 0,
                    item.sellerCurrency || "USD",
                    item.buyerCurrency || "USD",
                    currentRates // Pass the complete currentRates object
                  )
                : item.sellerPrice || item.price || 0; // Fallback to seller price

              return (
                <Box py="0.25rem" key={ind}>
                  <ProductCard1
                    id={item.id}
                    imgUrl={item.imgUrl || "/assets/images/default-product.png"} // Fallback image
                    title={item.title || "Untitled Product"} // Fallback title
                    rating={typeof item.rating === "object" ? item.rating.average : item.rating || 0} // Resolve to a number
                    off={item.discount || 0} // Default discount
                    sellerPrice={item.sellerPrice || item.price || 0} // Default seller price
                    buyerPrice={buyerPrice} // Dynamically calculated buyer price
                    sellerCurrency={item.sellerCurrency || "USD"} // Default seller currency
                    buyerCurrency={item.buyerCurrency || "USD"} // Default buyer currency
                    exchangeRates={
                      currentRates || { baseCurrency: "USD", rates: {} } // Provide a complete fallback object
                    }
                  />
                </Box>
              );
            })}
          </Carousel>
        )}
      </Box>
    </CategorySectionCreator>
  );
};

export default Section2;
