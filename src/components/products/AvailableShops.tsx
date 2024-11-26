import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "redux/slices/reduxHooks";
import { fetchShops } from "redux/slices/productSlice"; // Assume `fetchShops` is a thunk in `productSlice`
import Avatar from "../avatar/Avatar";
import Box from "../Box";
import Card from "../Card";
import FlexBox from "../FlexBox";
import Grid from "../grid/Grid";
import { H3, H4 } from "../Typography";

// Define the Shop type
interface Shop {
  id: string;
  imgUrl: string;
  name: string;
}

export interface AvailableShopsProps {
  productId: string; // Ensure this matches the type passed
}

const AvailableShops: React.FC<AvailableShopsProps> = ({ productId }) => {
  const dispatch = useAppDispatch();
  const { shops, loading, error } = useAppSelector((state) => state.products);

  useEffect(() => {
    // Dispatch fetchShops with productId or an empty object
    dispatch(fetchShops({ productId }));
  }, [dispatch, productId]);
  

  if (loading) return <p>Loading shops...</p>;
  if (error) return <p>Error loading shops: {error}</p>;

  return (
    <Box mb="3.75rem">
      <H3 mb="1.5rem">Also Available at</H3>
      <Grid container spacing={8}>
        {shops.map((shop: Shop) => (
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
