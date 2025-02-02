import FlexBox from "../../components/FlexBox";
import Grid from "../../components/grid/Grid";
import Hidden from "../../components/hidden/Hidden";
import Icon from "../../components/icon/Icon";
import NavbarLayout from "../../components/layout/NavbarLayout";
import ProductCardList from "../../components/products/ProductCard1List";
import ProductFilterCard from "../../components/products/ProductFilterCard";
import ShopIntroCard from "../../components/shop/ShopIntroCard";
import Sidenav from "../../components/sidenav/Sidenav";
import React from "react";
import useWindowSize from "../../hooks/useWindowSize";

const Shop = () => {
  const { width } = useWindowSize();  // Destructure 'width'
  const isTablet = width < 1025;      // Now 'width' is a number

  return (
    <div>
      <ShopIntroCard />
      <Grid container spacing={6}>
        <Hidden as={Grid} item md={3} xs={12} down={1024}>
          <ProductFilterCard />
        </Hidden>

        <Grid item md={9} xs={12}>
          {isTablet && (
            <Sidenav
              position="left"
              scroll={true}
              handle={
                <FlexBox justifyContent="flex-end" mb="12px">
                  <Icon>options</Icon>
                </FlexBox>
              }
            >
              <ProductFilterCard />
            </Sidenav>
          )}
          <ProductCardList />
        </Grid>
      </Grid>
    </div>
  );
};

Shop.layout = NavbarLayout;

export default Shop;
