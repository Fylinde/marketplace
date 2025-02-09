
import Box from "../../../components/Box";
import Card from "../../../components/Card";
import FlexBox from "../../../components/FlexBox";
import Grid from "../../../components/grid/Grid";
import LazyImage from "../../../components/LazyImage";
import NavLink from "../../../components/nav-link/NavLink";
import Typography, { H3, SemiSpan, Small }  from "../../../components/Typography";
import { Link } from 'react-router-dom';
import React from "react";
import { StyledMegaMenu1 } from "./MegaMenuStyle";

interface Image {
  imgUrl: string;
  href: string;
  alt?: string; // <-- Added optional alt attribute here for the Image interface
}

interface SubCategory {
  title: string;
  href: string;
}

interface Category {
  title: string;
  href?: string;
  subCategories: SubCategory[];
}

interface MegaMenu {
  categories: Category[];
  rightImage?: Image;
}

interface MegaMenuProps {
  data: MegaMenu;
  minWidth?: string;
}

const MegaMenu3: React.FC<MegaMenuProps> = ({
  data: { categories, rightImage },
  minWidth,
}) => {
  return categories ? (
    <StyledMegaMenu1 className="mega-menu">
      <Card ml="1rem" minWidth={minWidth} boxShadow="regular">
        <FlexBox px="1.25rem" py="0.875rem">
          <Box flex="1 1 0">
            <Grid container spacing={4}>
              {categories?.map((item, ind) => (
                <Grid item md={3} key={ind}>
                  {item.href ? (
                    <NavLink className="title-link" to={item.href}>
                      {item.title}
                    </NavLink>
                  ) : (
                    <SemiSpan className="title-link">{item.title}</SemiSpan>
                  )}
                  {item.subCategories?.map((sub) => (
                    <NavLink className="child-link" to={sub.href}>
                      {sub.title}
                    </NavLink>
                  ))}
                </Grid>
              ))}
            </Grid>
          </Box>

          {rightImage && (
          <Link to={rightImage.href}>
            <a>
              <Box position="relative" width="153px" height="100%">
                <LazyImage
                  src={rightImage.imgUrl}
                  style={{ objectFit: "contain", width: "100%", height: "100%" }} // Apply objectFit via inline styles
                  alt={rightImage.alt || "Right image"} // Added alt attribute here
                />
              </Box>
            </a>
          </Link>
        )}
        </FlexBox>

        <Link to="/sale-page-2">
          <a>
            <Grid
              container
              spacing={0}
              flexWrap="wrap-reverse"
              containerHeight="100%"
              alignItems="center"
            >
              <Grid item sm={6} xs={12}>
                <Box px="1.25rem">
                  <H3 mb="0.5rem">Big Sale Upto 60% Off</H3>

                  <Typography color="text.muted" mb="0.5rem">
                    Handcrafted from genuine Italian Leather
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
              <Grid item sm={6} xs={12}>
                <FlexBox
                  flexDirection="column"
                  justifyContent="flex-end"
                  height="160px"
                  position="relative"
                >
                <LazyImage
                  src="/assets/images/products/paper-bag.png"
                  style={{ objectFit: "contain", width: "100%", height: "100%" }} // Apply objectFit via inline styles
                  alt="Product image" // Added alt attribute here
                />
                </FlexBox>
              </Grid>
            </Grid>
          </a>
        </Link>
      </Card>
    </StyledMegaMenu1>
  ) : null;
};

MegaMenu3.defaultProps = {
  minWidth: "760px",
};

export default MegaMenu3;
