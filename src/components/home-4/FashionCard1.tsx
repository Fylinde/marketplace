import Box from "components/Box";
import Card from "components/Card";
import LazyImage from "components/LazyImage";
import Typography, { H3, Small, Span } from "components/Typography";
import { Link } from "react-router-dom";
import React from "react";

export interface FashionCard1Props {}

const FashionCard1: React.FC<FashionCard1Props> = () => {
  return (
    <Link to="/">
      {/* Removed unnecessary <a> tag */}
      <Card
        p="2.5rem"
        boxShadow="border"
        height="100%"
        borderRadius={4}
        hoverEffect
      >
        <LazyImage
          src="/assets/images/products/shoes-1.png"
          alt="shoes"
          style={{ width: '100%', height: 'auto', borderRadius: '4px' }}
        />

        <Box mt="3.5rem">
          <Typography color="text.muted" mb="0.5rem">
            SPECIAL OFFER
          </Typography>

          <H3 mb="0.5rem" fontSize="30px" lineHeight="1.3">
            <Span color="primary.main" fontSize="30px">
              Comfortable
            </Span>{" "}
            Original Cotton Sneaker
          </H3>

          <Typography color="text.muted" mb="1rem">
            Handcrafted from genuine Italian leather. One inner compartment
            with black satin lining
          </Typography>

          <Small
            fontWeight="700"
            borderBottom="2px solid"
            borderColor="primary.main"
          >
            SHOP NOW
          </Small>
        </Box>
      </Card>
    </Link>
  );
};

export default FashionCard1;
