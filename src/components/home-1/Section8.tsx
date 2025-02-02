import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Grid from "../../components/grid/Grid";
import LazyImage from "../../components/LazyImage";
import { Link } from "react-router-dom";
import Container from "../Container";
import { fetchBanners } from "../../redux/slices/marketing/bannerSlice";
import { RootState, AppDispatch } from "../../redux/store";
import { Banner } from "../../types/banner";


const Section8: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  // Extract banners and loading state from Redux
  const { banners, loading } = useSelector((state: RootState) => state.banners);

  // Fetch banners on component mount
  useEffect(() => {
    if (!banners.length) {
      dispatch(fetchBanners());
    }
  }, [dispatch, banners.length]);

  return (
    <Container mb="70px">
      {loading ? (
        <p>Loading banners...</p> // Display loading message while fetching data
      ) : (
        <Grid container spacing={5}>
          {banners.map((banner: Banner, index: number) => (
            <Grid
              item
              xs={12}
              md={banner.size === "large" ? 8 : 4} // Adjust size dynamically
              key={banner.id} // Use a unique key
            >
              <Link to={banner.link || "/"}>
                <LazyImage
                  src={banner.imgUrl}
                  height={342}
                  width={banner.size === "large" ? 790 : 385} // Adjust width based on size
                  style={{ objectFit: "contain" }}
                  alt={banner.alt || "banner"} // Provide a fallback for alt text
                  fallbackSrc="/assets/images/default-banner.png" // Fallback image for broken links
                />
              </Link>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Section8;
