import React, { useEffect, useState } from "react";
import Box from "components/Box";
import useWindowSize from "../../hooks/useWindowSize";
import Carousel from "../carousel/Carousel";
import CategorySectionCreator from "../CategorySectionCreator";
import ProductCard1 from "../product-cards/ProductCard1";
import { useDispatch, useSelector } from "react-redux";
import { fetchFlashDeals } from "../../redux/slices/products/productSlice";
import { RootState } from "redux/store"; // Adjust path based on your store structure
import type { AppDispatch } from "../../redux/store";
import { Product } from "types/Product";

const Section2: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { products, loading, error } = useSelector((state: RootState) => state.products);

  // Filter flash deals from products
  const flashDeals = products.filter((product: Product) => product.tag === "flash-deal");

  const [visibleSlides, setVisibleSlides] = useState(4);
  const { width } = useWindowSize(); // Extract the window width using custom hook

  useEffect(() => {
    // Adjust the number of visible slides based on screen width
    if (width !== null) {
      if (width < 500) setVisibleSlides(1);
      else if (width < 650) setVisibleSlides(2);
      else if (width < 950) setVisibleSlides(3);
      else setVisibleSlides(4);
    }
  }, [width]);

  useEffect(() => {
    // Dispatch the action to fetch products if not already fetched
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
            {flashDeals.map((item: Product, ind: number) => (
              <Box py="0.25rem" key={ind}>
                <ProductCard1
                  id={item.id}
                  imgUrl={item.imgUrl || "/assets/images/default-product.png"} // Fallback image
                  title={item.title || "Untitled Product"} // Fallback title
                  rating={typeof item.rating === "object" ? item.rating.average : item.rating || 0} // Resolve to a number
                  price={item.price || 0} // Default price
                  off={item.discount || 0} // Default discount
                  sellerPrice={item.sellerPrice || item.price || 0} // Default seller price
                  buyerPrice={item.buyerPrice || item.price || 0} // Default buyer price
                  sellerCurrency={item.sellerCurrency || "USD"} // Default seller currency
                  buyerCurrency={item.buyerCurrency || "USD"} // Default buyer currency
                />
              </Box>
            ))}
          </Carousel>
        )}
      </Box>
    </CategorySectionCreator>
  );
};

export default Section2;
