import AppStore from "components/AppStore";
import Image from "components/Image";
import { deviceSize } from "utils/constants";
import { Link } from "react-router-dom";
import React from "react";
import styled from "styled-components";
import { getTheme } from "../../utils/utils";
import Box from "../Box";
import FlexBox from "../FlexBox";
import Grid from "../grid/Grid";
import Icon from "../icon/Icon";
import { Paragraph } from "../Typography";

const StyledLink = styled(Link)`  // Updated to Link instead of 'a'
  display: block;
  padding: 0.35rem 0rem;
  color: ${getTheme("colors.gray.500")};
  cursor: pointer;
  border-radius: 4px;
  :hover {
    color: ${getTheme("colors.gray.100")};
  }
  z-index: 999;
  position: relative;
`;

const StyledBox = styled(Box)`
  margin-right: auto;
  margin-left: auto;

  @media only screen and (max-width: ${deviceSize.sm}px) {
    margin-right: unset;
    margin-left: unset;
  }
`;

const StyledFooterContainer = styled(Box)`
  margin-bottom: 1rem;

  @media only screen and (max-width: 900px) {
    margin-bottom: 3.75rem;
  }
`;

const GroceryFooter: React.FC = () => {
  return (
    <footer>
      <StyledFooterContainer
        p="40px"
        bg="#0F3460"
        borderRadius="8px"
        color="white"
        overflow="hidden"
      >
        {/* Use Link directly without the nested <a> */}
        <Link to="/">
          <Image mb="1.5rem" src="/assets/images/logo.svg" alt="logo" />
        </Link>

        <Grid container spacing={6}>
          <Grid item md={6} sm={6} xs={12}>
            <Paragraph mb="1.25rem" color="gray.500" maxWidth="370px">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Auctor
              libero id et, in gravida. Sit diam duis mauris nulla cursus. Erat
              et lectus vel ut sollicitudin elit at amet.
            </Paragraph>

            <AppStore />
          </Grid>

          <Grid item md={6} sm={6} xs={12}>
            <StyledBox maxWidth="230px" mt="-0.35rem">
              <div>
                {customerCareLinks.map((item, ind) => (
                  <StyledLink to="/" key={ind}> {/* StyledLink is now a Link */}
                    {item}
                  </StyledLink>
                ))}
              </div>

              <FlexBox mx="-5px" mt="1rem">
                {iconList.map((item, ind) => (
                  <Link to="/" key={ind}>
                    <Box
                      m="5px"
                      size="small"
                      p="10px"
                      bg="rgba(0,0,0,0.2)"
                      borderRadius="50%"
                      cursor="pointer"
                    >
                      <Icon size="12px" defaultcolor="auto">
                        {item}
                      </Icon>
                    </Box>
                  </Link>
                ))}
              </FlexBox>
            </StyledBox>
          </Grid>
        </Grid>
      </StyledFooterContainer>
    </footer>
  );
};

const customerCareLinks = [
  "Help Center",
  "Track Your Order",
  "Corporate & Bulk Purchasing",
  "Returns & Refunds",
];

const iconList = ["facebook", "twitter", "youtube", "google", "instagram"];

export default GroceryFooter;
