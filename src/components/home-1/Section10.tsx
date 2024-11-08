import LazyImage from "components/LazyImage";
import productDatabase from "data/product-database";
import { Link } from "react-router-dom";
import React from "react";
import Card from "../Card";
import CategorySectionHeader from "../CategorySectionHeader";
import Container from "../Container";
import Grid from "../grid/Grid";
import Typography from "../Typography";

const Section10: React.FC = () => {
  const fallbackImg = "/assets/images/default-product.png"; // Fallback image path

  return (
    <Container mb="70px">
      <CategorySectionHeader
        title="Categories"
        iconName="categories"
        seeMoreLink="#"
      />

      <Grid container spacing={6}>
        {categoryList.map((item, ind) => {
          const product = productDatabase[ind * 13 + 100]; // Reference product based on index
          const imgUrl = product?.imgUrl || fallbackImg; // Fallback if imgUrl is missing

          return (
            <Grid item lg={2} md={3} sm={4} xs={12} key={ind}>
              <Link to="/">
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
                    src={imgUrl}
                    alt="fashion"
                    height={52}
                    width={52}
                    style={{ objectFit: "contain", borderRadius: "8px" }}
                  />
                  <Typography fontWeight="600" fontSize="14px" ml="10px">
                    {item}
                  </Typography>
                </Card>
              </Link>
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
};

const categoryList = [
  "Automobile",
  "Car",
  "Fashion",
  "Electronics",
  "Mobile",
  "Laptop",
  "Desktop",
  "Tablet",
  "Fashion",
  "Electronics",
  "Furniture",
  "Camera",
];

export default Section10;
