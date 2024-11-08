import Box from "components/Box";
import Card from "components/Card";
import Container from "components/Container";
import { H2, SemiSpan, Small } from "components/Typography";
import { Link } from "react-router-dom";
import React from "react";
import styled from "styled-components";
import { deviceSize } from "utils/constants";

export interface Section10Props {}

type CardProps = {
  imgUrl?: string;
};

const StyledCard = styled(Card)<CardProps>`
  padding: 62px 78px;
  background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 1),
      rgba(255, 255, 255, 1),
      rgba(255, 255, 255, 0)
    ),
    url(${(props) => props.imgUrl});
  background-size: cover;

  @media only screen and (max-width: ${deviceSize.sm}px) {
    padding: 2rem;
  }
`;

const Section10: React.FC<Section10Props> = () => {
  return (
    <Container>
      <StyledCard
        imgUrl="/assets/images/products/bg-gradient.png"
        mb="3.75rem"
        hoverEffect
      >
        <Box maxWidth="390px">
          <H2 mb="0.5rem">Build Your Own Youtube Studio Save Upto 70%</H2>
          <SemiSpan color="text.muted" display="block" mb="1.5rem">
            Everything you need to create your youtube studio
          </SemiSpan>

          {/* Removed the unnecessary <a> tag */}
          <Link to="/">
            <Small
              fontWeight="700"
              borderBottom="2px solid"
              borderColor="primary.main"
            >
              DISCOVER EQUIPMENTS
            </Small>
          </Link>
        </Box>
      </StyledCard>
    </Container>
  );
};

export default Section10;
