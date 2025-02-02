import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Card from "../Card";
import Container from "../Container";
import FlexBox from "../FlexBox";
import Grid from "../grid/Grid";
import Icon from "../icon/Icon";
import { H4, SemiSpan } from "../Typography";
import { fetchFeatures } from "../../redux/slices/marketing/featureSlice"; // Redux action for fetching features
import { RootState, AppDispatch } from "../../redux/store"; // Adjust the import path based on your project structure

const Section12: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { features, loading, error } = useSelector((state: RootState) => state.features);

  useEffect(() => {
    if (features.length === 0) {
      dispatch(fetchFeatures()); // Fetch features if not already loaded
    }
  }, [dispatch, features.length]);

  return (
    <Container mb="70px">
      {loading ? (
        <SemiSpan>Loading services...</SemiSpan>
      ) : error ? (
        <SemiSpan color="error">Failed to load features: {error}</SemiSpan>
      ) : (
        <Grid container spacing={6}>
          {features.map((item, index) => (
            <Grid item lg={3} md={6} xs={12} key={item.id || index}>
              <FlexBox
                as={Card}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: "3rem",
                  height: "100%",
                  borderRadius: "8px",
                  boxShadow: "border",
                }}
                hoverEffect
              >
                <FlexBox
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: "300px",
                    backgroundColor: "gray.200",
                    width: "64px",
                    height: "64px",
                  }}
                >
                  <Icon color="secondary" size="1.75rem">
                    {item.iconName || "default-icon"} {/* Fallback for undefined icons */}
                  </Icon>
                </FlexBox>
                <H4 mt="20px" mb="10px" textAlign="center">
                  {item.title}
                </H4>
                <SemiSpan textAlign="center">
                  {item.description || "We provide top-notch services globally."}
                </SemiSpan>
              </FlexBox>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Section12;
