import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../redux/store";
import Card from "../../components/Card";
import CategorySectionCreator from "../CategorySectionCreator";
import Grid from "../grid/Grid";
import ProductCard2 from "../product-cards/ProductCard2";
import { fetchNewArrivals } from "../../redux/slices/products/productSlice";

const Section5: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { newArrivals, loading, error } = useSelector((state: RootState) => state.products);

  // Fetch new arrivals only if the list is empty
  useEffect(() => {
    if (newArrivals.length === 0) {
      console.log("Dispatching fetchNewArrivals");
      dispatch(fetchNewArrivals());
    }
  }, [dispatch, newArrivals.length]);

  console.log("New Arrivals Length:", newArrivals.length);
  console.log("First New Arrival:", newArrivals[0]);

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
            {newArrivals.slice(0, 12).map((item) => ( // Limit to first 12 items
              <Grid item lg={2} md={3} sm={4} xs={6} key={item.id}>
                <ProductCard2
                  title={item.title || "Untitled"}
                  imgUrl={item.imgUrl || "/assets/images/default-product.png"}
                  productUrl={`/product/${item.id}`}
                  sellerPrice={item.sellerPrice || 0}
                  buyerPrice={item.buyerPrice || 0}
                  sellerCurrency={item.sellerCurrency || "USD"}
                  buyerCurrency={item.buyerCurrency || "USD"}
                  onChatWithSeller={item.onChatWithSeller} // Optional: Only pass if defined
                  onTryNow={item.onTryNow} // Optional: Only pass if defined
                  tryOnAvailable={item.tryOnAvailable || false}
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
