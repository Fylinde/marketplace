import React, { useEffect, useState, ReactNode } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchFlashDeals,
  fetchSalesProducts,
 // fetchPersonalizedRecommendations,
  selectProducts,
  selectFlashDeals,
  selectPersonalizedRecommendations,
} from "../redux/slices/products/productSlice";
import {
  selectCurrentSegment,
  fetchUserProfile,
  updateUserPreferences,
} from "../redux/slices/auth/userSlice";
import Box from "../components/Box";
import { Chip } from "../components/Chip";
import Container from "../components/Container";
import FlexBox from "../components/FlexBox";
import Grid from "../components/grid/Grid";
import SaleLayout1 from "../components/layout/SaleLayout1";
import SaleNavbar from "../components/navbar/SaleNavbar";
import Pagination from "../components/pagination/Pagination";
import ProductCard1 from "../components/product-cards/ProductCard1";
import Sticky from "../components/sticky/Sticky";
import { H1, H5, SemiSpan } from "../components/Typography";
import type { AppDispatch, RootState } from "../redux/store";
import { Review } from "../types/review";
import { PageWithLayout } from "../types/pageLayouts";



const SalePage1: PageWithLayout = () => {
  const dispatch = useDispatch<AppDispatch>();

  const [page, setPage] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const products = useSelector(selectProducts);
  const flashDeals = useSelector(selectFlashDeals);
  const recommendations = useSelector(selectPersonalizedRecommendations);
  const currentSegment = useSelector(selectCurrentSegment);
  const currentRates = useSelector((state: RootState) => state.exchangeRate?.currentRates);

  const productPerPage = 28;

  const saleCategoryList: { title: string; icon: string; segment: "B2C" | "B2B" | "C2C" }[] = [
    { title: "Electronics", icon: "camera", segment: "B2C" },
    { title: "Bulk Supplies", icon: "warehouse", segment: "B2B" },
    { title: "Furniture", icon: "sofa", segment: "B2C" },
    { title: "Used Goods", icon: "recycle", segment: "C2C" },
    { title: "Office Supplies", icon: "briefcase", segment: "B2B" },
  ];

  useEffect(() => {
    dispatch(fetchFlashDeals());
    dispatch(fetchSalesProducts());
  //  dispatch(fetchPersonalizedRecommendations());
    dispatch(fetchUserProfile());
  }, [dispatch]);

  const handlePageChange = ({ selected }: { selected: number }) => {
    setPage(selected);
  };

  const handleSegmentChange = (segment: "B2B" | "B2C" | "C2C") => {
    dispatch(updateUserPreferences({ segment }));
  };

  const handleCategoryChange = (category: { icon: string; title: string }) => {
    setSelectedCategory(category.title);
  };

  const normalizeReviews = (reviews: Review[]): { comment: string; rating: number; user: string }[] =>
    reviews.map((review) => ({
      comment: review.comment,
      rating: review.rating,
      user: review.user || "Anonymous",
    }));

  const filteredProducts = selectedCategory
    ? products.filter((product) => product.category === selectedCategory)
    : products;

  const renderProductCount = () => {
    const startNumber = page * productPerPage + 1;
    const endNumber = Math.min(
      (page + 1) * productPerPage,
      filteredProducts.length
    );
    return `Showing ${startNumber}-${endNumber} of ${filteredProducts.length} products`;
  };

  return (
    <Container mt="2rem">
      <Sticky fixedOn={0}>
        <SaleNavbar
          saleCategoryList={saleCategoryList}
          currentSegment={currentSegment}
          onSegmentChange={handleSegmentChange}
          onCategoryChange={handleCategoryChange}
          showSearch={true}
        />
      </Sticky>

      <Box>
        <FlexBox mb="2rem" flexWrap="wrap" justifyContent="space-between">
          <Box>
            <H1 color="primary.main" lineHeight="1">
              Flash Deals,
            </H1>
            <H1 color="text.muted" lineHeight="1">
              Enjoy Up to 80% Discounts
            </H1>
          </Box>
          <Box>
            <Chip
              p="5px 15px"
              fontSize="14px"
              fontWeight="600"
              bg="primary.light"
              color="primary.main"
            >
              Your Segment: {currentSegment}
            </Chip>
          </Box>
        </FlexBox>
      </Box>

      <Box mb="4rem">
        <H5 mb="1rem">Flash Deals</H5>
        <Grid container spacing={6}>
          {flashDeals.map((deal, ind) => (
            <Grid item lg={3} md={4} sm={6} xs={12} key={ind}>
              <ProductCard1
                {...deal.product}
                discount={deal.discount}
                sellerPrice={deal.product.price}
                buyerPrice={deal.product.price}
                sellerCurrency="USD"
                buyerCurrency="USD"
                stock={deal.product.stock > 0}
                rating={
                  typeof deal.product.rating === "number"
                    ? deal.product.rating
                    : deal.product.rating?.average
                }
                reviews={normalizeReviews(deal.product.reviews)}
                exchangeRates={currentRates || { baseCurrency: "USD", rates: {} }} // Provide a fallback for exchange rates
              />
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box mb="4rem">
        <H5 mb="1rem">Recommended for You</H5>
        <Grid container spacing={6}>
          {recommendations.map((item, ind) => (
            <Grid item lg={3} md={4} sm={6} xs={12} key={ind}>
              <ProductCard1
                {...item}
                sellerPrice={item.price}
                buyerPrice={item.price}
                sellerCurrency="USD"
                buyerCurrency="USD"
                stock={item.stock > 0}
                rating={
                  typeof item.rating === "number"
                    ? item.rating
                    : item.rating?.average
                }
                reviews={normalizeReviews(item.reviews || [])}
                exchangeRates={currentRates || { baseCurrency: "USD", rates: {} }} // Provide a fallback for exchange rates
              />
            </Grid>
          ))}
        </Grid>
      </Box>

      <Grid container spacing={6}>
        {filteredProducts.map((product, ind) => (
          <Grid item lg={3} md={4} sm={6} xs={12} key={ind}>
            <ProductCard1
              {...product}
              sellerPrice={product.price}
              buyerPrice={product.price}
              sellerCurrency="USD"
              buyerCurrency="USD"
              stock={product.stock > 0}
              rating={
                typeof product.rating === "number"
                  ? product.rating
                  : product.rating?.average
              }
              reviews={normalizeReviews(product.reviews || [])}
              exchangeRates={currentRates || { baseCurrency: "USD", rates: {} }} // Provide a fallback for exchange rates
            />
          </Grid>
        ))}
      </Grid>

      <FlexBox
        flexWrap="wrap"
        justifyContent="space-between"
        alignItems="center"
        my="4rem"
      >
        <SemiSpan>{renderProductCount()}</SemiSpan>
        <Pagination
          pageCount={Math.ceil(filteredProducts.length / productPerPage)}
          onChange={handlePageChange}
        />
      </FlexBox>
    </Container>
  );
};

// Explicitly assign a layout to the page
SalePage1.layout = ({ children }: { children: ReactNode }) => (
  <SaleLayout1
    title="Amazing Sales | Multiseller Ecommerce"
    metaDescription="Discover flash deals and exclusive recommendations tailored for you."
  >
    {children}
  </SaleLayout1>
);

export default SalePage1;
