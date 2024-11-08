import Box from "components/Box";
import Card from "components/Card";
import FlexBox from "components/FlexBox";
import Grid from "components/grid/Grid";
import Image from "components/Image";
import LazyImage from "components/LazyImage";
import NavLink from "components/nav-link/NavLink";
import { SemiSpan } from "components/Typography";
import { Link } from "react-router-dom";  // Use react-router-dom Link
import React from "react";
import { StyledMegaMenu1 } from "./MegaMenuStyle";

interface Image {
  imgUrl: string;
  href: string;
  alt?: string;
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
  bottomImage?: Image;
}

interface MegaMenuProps {
  data: MegaMenu;
  minWidth?: string;
}

const MegaMenu1: React.FC<MegaMenuProps> = ({
  data: { categories, rightImage, bottomImage },
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
              <Box position="relative" width="153px" height="100%">
              <LazyImage
                src={rightImage.imgUrl}
                alt={rightImage.alt || "Right image"}
                style={{ objectFit: "contain" }}  // Apply objectFit as a style
              />
              </Box>
            </Link>
          )}
        </FlexBox>

        {bottomImage && (
          <Link to={bottomImage.href}>  {/* Changed href to to */}
            <Box position="relative" height="170px">
            <LazyImage
              src={bottomImage.imgUrl}
              alt={bottomImage.alt || "Bottom image"}
              style={{ objectFit: "cover" }}  // Apply objectFit as a style
            />
            </Box>
          </Link>
        )}
      </Card>
    </StyledMegaMenu1>
  ) : null;
};

MegaMenu1.defaultProps = {
  minWidth: "760px",
};

export default MegaMenu1;
