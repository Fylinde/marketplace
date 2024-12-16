import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "redux/store"; // Adjust based on your project structure
import Card from "components/Card";
import CategorySectionCreator from "../CategorySectionCreator";
import Grid from "../grid/Grid";
import ProductCard2 from "../product-cards/ProductCard2";
import { fetchNewArrivals } from "../../redux/slices/products/productSlice"; // Redux action for fetching new arrivals

const Section5: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { newArrivals, loading, error } = useSelector((state: RootState) => state.products);

  // Fetch new arrivals on component mount
  useEffect(() => {
    if (!newArrivals.length) {
      dispatch(fetchNewArrivals());
    }
  }, [dispatch, newArrivals.length]);

  return (
    <CategorySectionCreator
      iconName="new-product-1"
      title="New Arrivals"
      seeMoreLink="#"
    >
      <Card p="1rem">
        {loading ? (
          <p>Loading New Arrivals...</p>
        ) : error ? (
          <p>Error loading new arrivals: {error}</p>
        ) : (
          <Grid container spacing={6}>
            {newArrivals.map((item) => (
              <Grid item lg={2} md={3} sm={4} xs={6} key={item.id}>
                <ProductCard2
                  title={item.title || "Untitled"} // Fallback for missing title
                  imgUrl={item.imgUrl || "/assets/images/default-product.png"} // Fallback for missing image
                  productUrl={`/product/${item.id}`} // Generate dynamic product URL
                  sellerPrice={item.sellerPrice || 0} // Fallback for missing seller price
                  buyerPrice={item.buyerPrice || 0} // Fallback for missing buyer price
                  sellerCurrency={item.sellerCurrency || "USD"} // Default seller currency
                  buyerCurrency={item.buyerCurrency || "USD"} // Default buyer currency
                  onChatWithSeller={item.onChatWithSeller} // Optional: Chat with seller handler
                  onTryNow={item.onTryNow} // Optional: Visual TryOn handler
                  tryOnAvailable={item.tryOnAvailable || false} // Fallback for TryOn availability
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Card>
    </CategorySectionCreator>
  );
};

export default Section5;
