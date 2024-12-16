import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/redux/reduxHooks";
import { fetchShops } from "@/redux/slices/products/productSlice"; // Assume `fetchShops` is parameterless
import Avatar from "../avatar/Avatar";
import Box from "../Box";
import Card from "../Card";
import FlexBox from "../FlexBox";
import Grid from "../grid/Grid";
import { H3, H4, Paragraph } from "../Typography";
import { Shop } from "../../types/shop"; // Ensure correct Shop type import

export interface AvailableShopsProps {
  productId: string; // Ensure this matches the type passed
}

const AvailableShops: React.FC<AvailableShopsProps> = ({ productId }) => {
  const dispatch = useAppDispatch();
  const { shops, loading, error } = useAppSelector((state) => state.products);

  useEffect(() => {
    // Dispatch fetchShops without arguments
    dispatch(fetchShops());
  }, [dispatch]);

  // Filter shops by productId
  const filteredShops = shops.filter((shop: Shop) => shop.products?.includes(productId));

  if (loading) {
    return (
      <Box mb="3.75rem">
        <H3 mb="1.5rem">Also Available at</H3>
        <Paragraph>Loading shops...</Paragraph>
      </Box>
    );
  }

  if (error) {
    return (
      <Box mb="3.75rem">
        <H3 mb="1.5rem">Also Available at</H3>
        <Paragraph>Error loading shops: {error}</Paragraph>
      </Box>
    );
  }

  if (!filteredShops.length) {
    return (
      <Box mb="3.75rem">
        <H3 mb="1.5rem">Also Available at</H3>
        <Paragraph>No shops available for this product.</Paragraph>
      </Box>
    );
  }

  return (
    <Box mb="3.75rem">
      <H3 mb="1.5rem">Also Available at</H3>
      <Grid container spacing={8}>
        {filteredShops.map((shop) => (
          <Grid item lg={2} md={3} sm={4} xs={12} key={shop.id}>
            <Link to={`/shop/${shop.id}`} style={{ textDecoration: "none" }}>
              <FlexBox
                as={Card}
                p="26px"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                width="100%"
              >
                <Avatar src={shop.imgUrl} />
                <H4 mt="0.75rem" color="gray.800">
                  {shop.name}
                </H4>
              </FlexBox>
            </Link>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default AvailableShops;
