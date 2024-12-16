import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Box from "components/Box";
import Card from "components/Card";
import Carousel from "components/carousel/Carousel";
import FlexBox from "components/FlexBox";
import HoverBox from "components/HoverBox";
import LazyImage from "components/LazyImage";
import { H4 } from "components/Typography";
import { RootState, AppDispatch } from "redux/store";
import { fetchProductsByTag } from "../../redux/slices/products/productSlice";
import useWindowSize from "hooks/useWindowSize";
import { Link } from "react-router-dom";
import CategorySectionCreator from "../CategorySectionCreator";
import { Product } from "@/types/Product";

// Define the structure of the product


const Section13: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { productsByTag, loadingProductsByTag } = useSelector((state: RootState) => state.products);

  const { width } = useWindowSize();
  const [visibleSlides, setVisibleSlides] = React.useState(6);

  const products: Product[] = productsByTag["Big Discounts"] || []; // Products categorized under "Big Discounts"
  const loading = loadingProductsByTag["Big Discounts"] || false;

  // Adjust visible slides based on screen width
  useEffect(() => {
    if (width && width < 370) setVisibleSlides(1);
    else if (width && width < 650) setVisibleSlides(2);
    else if (width && width < 950) setVisibleSlides(4);
    else setVisibleSlides(6);
  }, [width]);

  // Fetch products when the component mounts
  useEffect(() => {
    if (!products.length) {
      dispatch(fetchProductsByTag({ tag: "Big Discounts" }));
    }
  }, [dispatch, products]);

  return (
    <CategorySectionCreator iconName="gift" title="Big Discounts" seeMoreLink="#">
      <Box my="-0.25rem">
        {loading ? (
          <p>Loading products...</p>
        ) : (
          <Carousel totalSlides={products.length} visibleSlides={visibleSlides}>
            {products.map((item) => (
              <Box py="0.25rem" key={item.id}>
                <Card p="1rem">
                  <Link to={`/product/${item.id}`}>
                    <HoverBox borderRadius={8} mb="0.5rem">
                      <LazyImage
                        src={item.imgUrl || "/assets/images/default-product.png"}
                        alt={item.title || "Product Image"}
                        style={{
                          width: "100%",
                          height: "auto",
                          objectFit: "contain",
                        }}
                      />
                    </HoverBox>
                    <H4 fontWeight="600" fontSize="14px" mb="0.25rem">
                      {item.title || "Unnamed Product"}
                    </H4>

                    <FlexBox>
                      <H4 fontWeight="600" fontSize="14px" color="primary.main" mr="0.5rem">
                        ${item.discountedPrice?.toLocaleString() || item.price.toLocaleString()}
                      </H4>

                      {item.discountedPrice && (
                        <H4 fontWeight="600" fontSize="14px" color="text.muted">
                          <del>${item.price.toLocaleString()}</del>
                        </H4>
                      )}
                    </FlexBox>
                  </Link>
                </Card>
              </Box>
            ))}
          </Carousel>
        )}
      </Box>
    </CategorySectionCreator>
  );
};

export default Section13;
