import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import CategorySectionHeader from "../CategorySectionHeader";
import Container from "../Container";
import Grid from "../grid/Grid";
import ProductCard1 from "../product-cards/ProductCard1";
import { fetchProductsByTag } from "../../redux/slices/products/productSlice"; // Redux action for fetching products by tag
import { RootState, AppDispatch } from "redux/store"; // Adjust the import path based on your project structure
import { Product } from "types/Product";
// Define Product type if not already defined

const Section11: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { productsByTag, loadingProductsByTag } = useSelector(
    (state: RootState) => state.products
  );

  useEffect(() => {
    if (!productsByTag["More For You"]) {
      dispatch(fetchProductsByTag({ tag: "More For You" })); // Dispatch action to fetch products with "More For You" tag
    }
  }, [dispatch, productsByTag]);

  const products: Product[] = productsByTag["More For You"] || []; // Ensure the type is correct

  return (
    <Container mb="70px">
      <CategorySectionHeader title="More For You" seeMoreLink="#" />

      {loadingProductsByTag["More For You"] ? (
        <p>Loading products...</p>
      ) : (
        <Grid container spacing={6}>
          {products.map((item, index) => (
            <Grid item lg={3} md={4} sm={6} xs={12} key={item.id || index}>
              <ProductCard1
                id={item.id}
                imgUrl={item.imgUrl || "/assets/images/default-product.png"}
                title={item.title || "No Title Available"}
                price={item.price}
                sellerPrice={item.sellerPrice}
                buyerPrice={item.buyerPrice}
                sellerCurrency={item.sellerCurrency}
                buyerCurrency={item.buyerCurrency}
                off={item.discount || 0}
                hoverEffect
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Section11;
