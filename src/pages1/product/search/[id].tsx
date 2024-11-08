import Box from "components/Box";
import IconButton from "components/buttons/IconButton";
import Card from "components/Card";
import FlexBox from "components/FlexBox";
import Grid from "components/grid/Grid";
import Hidden from "components/hidden/Hidden";
import Icon from "components/icon/Icon";
import NavbarLayout from "components/layout/NavbarLayout";
import ProductCard1List from "components/products/ProductCard1List";
import ProductCard9List from "components/products/ProductCard9List";
import ProductFilterCard from "components/products/ProductFilterCard";
import Select from "components/Select";
import Sidenav from "components/sidenav/Sidenav";
import { H5, Paragraph } from "components/Typography";
import React, { ReactNode, useCallback, useState } from "react";
import useWindowSize from "../../../hooks/useWindowSize";

type PageWithLayout = React.FC & {
  layout?: React.FC<{ children: ReactNode }>;
};

const ProductSearchResult: PageWithLayout = () => {
  const [view, setView] = useState<"grid" | "list">("grid");
  const { width = 1025 } = useWindowSize();  // Set a default width to avoid undefined
  const isTablet = width < 1025;

  const toggleView = useCallback(
    (v: "grid" | "list") => () => {
      setView(v);
    },
    []
  );

  return (
    <Box pt="20px">
      <FlexBox
        p="1.25rem"
        flexWrap="wrap"
        justifyContent="space-between"
        alignItems="center"
        mb="55px"
        elevation={5}
        as={Card}
      >
        <div>
          <H5>Searching for “ mobile phone ”</H5>
          <Paragraph color="text.muted">48 results found</Paragraph>
        </div>
        <FlexBox alignItems="center" flexWrap="wrap">
          <Paragraph color="text.muted" mr="1rem">
            Sort by:
          </Paragraph>
          <Box flex="1 1 0" mr="1.75rem" minWidth="150px">
            <Select
              placeholder="Sort by"
              defaultValue={sortOptions[0] ?? { label: "Relevance", value: "Relevance" }}
              options={sortOptions}
            />
          </Box>

          <Paragraph color="text.muted" mr="0.5rem">
            View:
          </Paragraph>
          <IconButton size="small" onClick={toggleView("grid")}>
            <Icon
              variant="small"
              defaultcolor="auto"
              color={view === "grid" ? "primary" : "inherit"}
            >
              grid
            </Icon>
          </IconButton>
          <IconButton size="small" onClick={toggleView("list")}>
            <Icon
              variant="small"
              defaultcolor="auto"
              color={view === "list" ? "primary" : "inherit"}
            >
              menu
            </Icon>
          </IconButton>

          {isTablet && (
            <Sidenav
              position="left"
              scroll={true}
              handle={
                <IconButton size="small">
                  <Icon>options</Icon>
                </IconButton>
              }
            >
              <ProductFilterCard />
            </Sidenav>
          )}
        </FlexBox>
      </FlexBox>

      <Grid container spacing={6}>
        <Hidden as={Grid} item lg={3} xs={12} down={1024}>
          <ProductFilterCard />
        </Hidden>

        <Grid item lg={9} xs={12}>
          {view === "grid" ? <ProductCard1List /> : <ProductCard9List />}
        </Grid>
      </Grid>
    </Box>
  );
};

const sortOptions = [
  { label: "Relevance", value: "Relevance" },
  { label: "Date", value: "Date" },
  { label: "Price Low to High", value: "Price Low to High" },
  { label: "Price High to Low", value: "Price High to Low" },
];

// Ensure NavbarLayout is properly assigned
ProductSearchResult.layout = NavbarLayout as React.FC<{ children: ReactNode }>;

export default ProductSearchResult;
