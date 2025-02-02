import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import CategorySectionHeader from "../CategorySectionHeader";
import Container from "../Container";
import Grid from "../grid/Grid";
import ProductCard1 from "../product-cards/ProductCard1";
import { fetchProductsByTag } from "../../redux/slices/products/productSlice";
import { RootState, AppDispatch } from "../../redux/store";
import { Product } from "../../types/Product";
import { convertCurrency } from "../../utils/currencyConversion";

const Section11: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { productsByTag, loadingProductsByTag } = useSelector(
    (state: RootState) => state.products
  );
  const { currentRates } = useSelector((state: RootState) => state.exchangeRate);

  const products: Product[] = productsByTag["More For You"] || []; // Products for "More For You" tag
  const loading = loadingProductsByTag["More For You"] || false;

  // Debug logs
  console.log("Products by Tag (More For You):", products);
  console.log("Loading State (More For You):", loading);
  console.log("Exchange Rates:", currentRates);

  // Fetch products with "More For You" tag if not already fetched
  useEffect(() => {
    if (!products.length) {
      console.log("Fetching products for More For You");
      dispatch(fetchProductsByTag({ tag: "More For You" }));
    }
  }, [dispatch, products.length]);

  return (
    <Container mb="70px">
      <CategorySectionHeader title="More For You" seeMoreLink="#" />

      {loading ? (
        <p>Loading products...</p>
      ) : products.length > 0 ? (
        <Grid container spacing={6}>
          {products.map((item, index) => {
            // Dynamically calculate buyer price using convertCurrency utility
            const buyerPrice = currentRates
              ? convertCurrency(
                  item.sellerPrice || 0,
                  item.sellerCurrency || "USD",
                  item.buyerCurrency || "USD",
                  currentRates
                )
              : item.sellerPrice || 0;

            return (
              <Grid item lg={3} md={4} sm={6} xs={12} key={item.id || index}>
                <ProductCard1
                  id={item.id}
                  imgUrl={item.imgUrl || "/assets/images/default-product.png"}
                  title={item.title || "No Title Available"}
                  sellerPrice={item.sellerPrice || 0}
                  buyerPrice={buyerPrice}
                  sellerCurrency={item.sellerCurrency || "USD"}
                  buyerCurrency={item.buyerCurrency || "USD"}
                  exchangeRates={
                    currentRates || { baseCurrency: "USD", rates: {} }
                  }
                  off={item.discount || 0}
                  hoverEffect
                />
              </Grid>
            );
          })}
        </Grid>
      ) : (
        <p>No products available for "More For You".</p>
      )}
    </Container>
  );
};

export default Section11;
