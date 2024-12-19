import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import CategorySectionHeader from "../CategorySectionHeader";
import Container from "../Container";
import Grid from "../grid/Grid";
import ProductCard1 from "../product-cards/ProductCard1";
import { fetchProductsByTag } from "../../redux/slices/products/productSlice";
import { RootState, AppDispatch } from "redux/store";
import { Product } from "types/Product";
import { convertCurrency } from "../../utils/currencyConversion"; // Import conversion utility

const Section11: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { productsByTag, loadingProductsByTag } = useSelector(
    (state: RootState) => state.products
  );
  const { currentRates } = useSelector((state: RootState) => state.exchangeRate); // Fetch exchange rates

  useEffect(() => {
    if (!productsByTag["More For You"]) {
      dispatch(fetchProductsByTag({ tag: "More For You" })); // Fetch products with "More For You" tag
    }
  }, [dispatch, productsByTag]);

  const products: Product[] = productsByTag["More For You"] || []; // Ensure correct type

  return (
    <Container mb="70px">
      <CategorySectionHeader title="More For You" seeMoreLink="#" />

      {loadingProductsByTag["More For You"] ? (
        <p>Loading products...</p>
      ) : (
        <Grid container spacing={6}>
          {products.map((item, index) => {
            const buyerPrice = currentRates
              ? convertCurrency(
                  item.sellerPrice,
                  item.sellerCurrency,
                  item.buyerCurrency,
                  currentRates // Pass the complete currentRates object
                )
              : item.sellerPrice; // Fallback to seller price if rates are unavailable

            return (
              <Grid item lg={3} md={4} sm={6} xs={12} key={item.id || index}>
                <ProductCard1
                  id={item.id}
                  imgUrl={item.imgUrl || "/assets/images/default-product.png"}
                  title={item.title || "No Title Available"}
                  sellerPrice={item.sellerPrice}
                  buyerPrice={buyerPrice} // Dynamically calculated buyer price
                  sellerCurrency={item.sellerCurrency}
                  buyerCurrency={item.buyerCurrency}
                  exchangeRates={
                    currentRates || { baseCurrency: "USD", rates: {} } // Provide full fallback ExchangeRate
                  }
                  off={item.discount || 0}
                  hoverEffect
                />
              </Grid>
            );
          })}
</Grid>

      )}
    </Container>
  );
};

export default Section11;
