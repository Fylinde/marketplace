import Grid from "components/grid/Grid";
import LazyImage from "components/LazyImage";
import { Link } from "react-router-dom";
import React from "react";
import Container from "../Container";

const Section8: React.FC = () => {
  return (
    <Container mb="70px">
      <Grid container spacing={5}>
        <Grid item xs={12} md={4}>
          <Link to="/">
            <LazyImage
              src="/assets/images/banners/banner-1.png"
              height={342}
              width={385}
              style={{ objectFit: "contain" }}  // Apply objectFit via the style prop
              alt="banner"
            />
          </Link>
        </Grid>
        <Grid item xs={12} md={8}>
          <Link to="/">
            <LazyImage
              src="/assets/images/banners/banner-2.png"
              height={342}
              width={790}
              style={{ objectFit: "contain" }}  // Apply objectFit via the style prop
              alt="banner"
            />
          </Link>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Section8;
