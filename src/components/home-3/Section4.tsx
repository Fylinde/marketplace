import FlexBox from "components/FlexBox";
import LazyImage from "components/LazyImage";
import { Link } from "react-router-dom";
import React from "react";
import styled from "styled-components";
import { getTheme } from "utils/utils";
import Box from "../Box";
import Card from "../Card";
import Grid from "../grid/Grid";
import Typography, { H3, Small } from "../Typography";

export interface Section4Props {}

const StyledCard = styled(Card)`
  transition: all 250ms ease-in-out;

  :hover {
    box-shadow: ${getTheme("shadows.large")};
  }
`;

const Section4: React.FC<Section4Props> = () => {
  return (
    <Box flex="1 1 0" mb="3rem">
      <Link to="/">
        <StyledCard boxShadow="border" borderRadius={4} height="100%">
          <Grid
            container
            spacing={0}
            style={{ display: "flex", flexWrap: "wrap-reverse", height: "100%" }}
          >
            <Grid item sm={6} xs={12}>
              <Box p="1rem" position="relative">
                <FlexBox
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    minHeight: "190px",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    position: "relative",
                  }}
                >
                  <LazyImage
                    src="/assets/images/products/kris-gerhard-0BKZfcamvGg-unsplash-removebg-preview 1.png"
                    alt="shoe"
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                  />
                </FlexBox>
              </Box>
            </Grid>

            <Grid item sm={6} xs={12}>
              <Box p="2rem">
                <H3 mb="0.5rem">Converse Collections</H3>

                <Typography color="text.muted" mb="1.5rem" maxWidth="200px">
                  Get the most exciting deals. Starting at $59
                </Typography>

                <Small
                  fontWeight="700"
                  borderBottom="2px solid"
                  borderColor="primary.main"
                >
                  SHOP NOW
                </Small>
              </Box>
            </Grid>
          </Grid>
        </StyledCard>
      </Link>
    </Box>
  );
};

export default Section4;
