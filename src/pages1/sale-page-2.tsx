import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchSegmentAnalytics,
  selectSegmentAnalytics,
} from "../redux/slices/analytics/analyticsSlice";
import {
  fetchSalesProducts,
  selectProducts,
} from "../redux/slices/products/productSlice";
import Container from "../components/Container";
import FlexBox from "../components/FlexBox";
import Grid from "../components/grid/Grid";
import SaleLayout2 from "../components/layout/SaleLayout2";
import Pagination from "../components/pagination/Pagination";
import ProductCard1 from "../components/product-cards/ProductCard1";
import Box from "../components/Box";
import { H1, H5, SemiSpan } from "../components/Typography";
import type { AppDispatch, RootState } from "../redux/store";
import { Review } from "../types/review";
import { Product } from "../types/Product"; // Import the Product type

const saleCategoryList: { icon: string; title: string; segment: "B2C" | "B2B" | "C2C" }[] = [
  { icon: "t-shirt", title: "Men", segment: "B2C" },
  { icon: "women-dress", title: "Women", segment: "B2C" },
  { icon: "camera", title: "Electronics", segment: "B2B" },
  { icon: "sofa", title: "Furniture", segment: "B2C" },
  { icon: "basket-ball", title: "Sport", segment: "C2C" },
];

const SalePage2 = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [page, setPage] = useState(0);
  const productPerPage = 28;

  // Redux state selectors
  const products: Product[] = useSelector(selectProducts); // Ensure products is typed as an array of Product
  const b2cAnalytics = useSelector(selectSegmentAnalytics("B2C"));
  const b2bAnalytics = useSelector(selectSegmentAnalytics("B2B"));
  const c2cAnalytics = useSelector(selectSegmentAnalytics("C2C"));
  const { currentRates } = useSelector((state: RootState) => state.exchangeRate); // Fetch exchange rates

  useEffect(() => {
    dispatch(fetchSalesProducts());
    dispatch(fetchSegmentAnalytics());
  }, [dispatch]);

  const normalizeReviews = (
    reviews: Review[]
  ): { comment: string; rating: number; user: string }[] =>
    reviews.map((review) => ({
      comment: review.comment,
      rating: review.rating,
      user: review.user || "Anonymous",
    }));

  const handlePageChange = ({ selected }: { selected: number }) => {
    setPage(selected);
  };

  return (
    <Container mt="2rem">
      {/* Segment Analytics */}
      <Box mb="4rem">
        <FlexBox justifyContent="space-between">
          <H1>B2C Analytics</H1>
          <H1>Total Revenue: ${b2cAnalytics?.totalRevenue || 0}</H1>
        </FlexBox>
        <FlexBox justifyContent="space-between">
          <H5>B2B Orders: {b2bAnalytics?.totalOrders || 0}</H5>
          <H5>C2C Categories: {c2cAnalytics?.topCategories?.join(", ") || "None"}</H5>
        </FlexBox>
      </Box>

      {/* Product Grid */}
      <Grid container spacing={6}>
        {products
          .slice(page * productPerPage, (page + 1) * productPerPage)
          .map((product: Product, ind: number) => (
            <Grid item lg={3} md={4} sm={6} xs={12} key={ind}>
              <ProductCard1
                id={product.id}
                name={product.name}
                sellerPrice={product.sellerPrice}
                buyerPrice={product.buyerPrice}
                sellerCurrency={product.sellerCurrency}
                buyerCurrency={product.buyerCurrency}
                stock={product.stock > 0}
                rating={
                  typeof product.rating === "number"
                    ? product.rating
                    : product.rating?.average
                }
                reviews={normalizeReviews(product.reviews || [])}
                exchangeRates={currentRates || { baseCurrency: "USD", rates: {} }} // Provide exchange rates
              />
            </Grid>
          ))}
      </Grid>

      {/* Pagination */}
      <FlexBox
        flexWrap="wrap"
        justifyContent="space-between"
        alignItems="center"
        my="4rem"
      >
        <SemiSpan>
          Showing {page * productPerPage + 1}-{Math.min(
            (page + 1) * productPerPage,
            products.length
          )}{" "}
          of {products.length} products
        </SemiSpan>
        <Pagination
          pageCount={Math.ceil(products.length / productPerPage)}
          onChange={handlePageChange}
        />
      </FlexBox>
    </Container>
  );
};

// Pass `saleCategoryList` explicitly to `SaleLayout2`
SalePage2.layout = (props: { children: React.ReactNode }) => (
  <SaleLayout2 saleCategoryList={saleCategoryList} {...props} />
);

export default SalePage2;
