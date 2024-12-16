import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import LazyImage from "components/LazyImage";
import Card from "../Card";
import CategorySectionHeader from "../CategorySectionHeader";
import Container from "../Container";
import Grid from "../grid/Grid";
import Typography from "../Typography";
import { fetchCategories } from "../../redux/slices/products/categorySlice"; // Redux action for fetching categories
import { RootState, AppDispatch } from "redux/store"; // Adjust the import path based on your project structure

// Extend the Category interface to ensure proper typing
interface Category {
  id: string; // Unique identifier
  name?: string; // Category name (optional)
  link?: string; // Link to the category page (optional)
  imgUrl?: string; // Image URL for the category (optional)
}

const Section10: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { categories, loadingCategories } = useSelector(
    (state: RootState) => state.categories
  );
  const fallbackImg = "/assets/images/default-product.png"; // Fallback image path

  useEffect(() => {
    if (!categories.length) {
      dispatch(fetchCategories()); // Dispatch action to fetch categories
    }
  }, [dispatch, categories.length]);

  return (
    <Container mb="70px">
      <CategorySectionHeader
        title="Categories"
        iconName="categories"
        seeMoreLink="#"
      />

      {loadingCategories ? (
        <Typography>Loading categories...</Typography>
      ) : (
        <Grid container spacing={6}>
          {categories.map((category: Category, index: number) => (
            <Grid item lg={2} md={3} sm={4} xs={12} key={category.id || index}>
              <Link to={category.link || "/"}>
                <Card
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "0.75rem",
                    boxShadow: "small",
                    borderRadius: "8px",
                  }}
                  hoverEffect
                >
                  <LazyImage
                    src={category.imgUrl || fallbackImg}
                    alt={category.name || "Category"}
                    height={52}
                    width={52}
                    style={{ objectFit: "contain", borderRadius: "8px" }}
                  />
                  <Typography fontWeight="600" fontSize="14px" ml="10px">
                    {category.name || "Unnamed Category"}
                  </Typography>
                </Card>
              </Link>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Section10;
