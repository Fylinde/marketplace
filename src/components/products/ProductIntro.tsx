import React, { useState, useCallback } from "react";
import Box from "../Box";
import Button from "../buttons/Button";
import Grid from "../grid/Grid";
import { H1, H2, H6, SemiSpan } from "../Typography";
import FlexBox from "../FlexBox";
import LazyImage from "components/LazyImage";
import Rating from "../rating/Rating";
import Avatar from "../avatar/Avatar";
import TryOnModal from "../TryOn/TryOnModal";
import { CartItem } from "reducers/cartReducer";
import { useAppContext } from "contexts/app/AppContext";

export interface ProductIntroProps {
  product: {
    id: string | number;
    images: string[];
    title: string;
    price: number;
    brand?: string;
    stock?: boolean;
    vendorId?: string;
    vendorName?: string;
    description?: string; // Add this property
  };
}

const ProductIntro: React.FC<ProductIntroProps> = ({ product }) => {
  const [selectedImage, setSelectedImage] = useState<number>(0); // Track selected image index
  const [isTryOnModalOpen, setTryOnModalOpen] = useState<boolean>(false); // Try-On modal state
  const { state, dispatch } = useAppContext();
  const cartList: CartItem[] = state.cart.cartList;
  const images = product.images.length > 0 ? product.images : ["/assets/images/default.png"]; // Fallback
  const cartItem = cartList.find((item) => item.id === product.id);

  const handleImageClick = (index: number) => () => setSelectedImage(index);

  const handleCartAmountChange = useCallback(
    (amount: number) => {
      dispatch({
        type: "CHANGE_CART_AMOUNT",
        payload: {
          qty: amount,
          name: product.title,
          price: product.price,
          imgUrl: product.images[selectedImage] || "/assets/images/default.png",
          id: product.id,
        },
      });
    },
    [dispatch, product, selectedImage]
  );

  return (
    <Box overflow="hidden">
      <Grid container spacing={3}>
        {/* Images Section */}
        <Grid item md={6} xs={12}>
          <FlexBox justifyContent="center" mb="50px">
            <LazyImage
              src={product.images[selectedImage] || "/assets/images/default.png"} // Fallback image
              alt={product.title}
              height={300}
              width="auto"
            />
          </FlexBox>
          <FlexBox style={{ gap: "10px" }}>
            {(product.images && product.images.length > 0 ? product.images : ["/assets/images/default.png"]).map(
              (url, index) => (
                <Box
                  key={index}
                  onClick={handleImageClick(index)}
                  border={selectedImage === index ? "2px solid #007185" : "1px solid gray"}
                  style={{ cursor: "pointer", margin: "5px" }} // Added style for better UX
                >
                  <Avatar src={url} size={40} />
                </Box>
              )
            )}
          </FlexBox>
        </Grid>

        {/* Info Section */}
        <Grid item md={6} xs={12}>
          <H1>{product.title}</H1>
          <H2>${product.price.toFixed(2)}</H2>
          <SemiSpan>Brand: {product.brand || "Unknown"}</SemiSpan>
          <FlexBox alignItems="center" mt="1rem">
            <Rating value={4.5} outof={5} />
            <SemiSpan style={{ marginLeft: "8px" }}>({4} reviews)</SemiSpan>
          </FlexBox>

          {/* Add to Cart and Try-On Section */}
          <FlexBox mt="2rem" style={{ gap: "1rem" }}>
            <Button variant="contained" onClick={() => handleCartAmountChange(1)}>
              Add to Cart
            </Button>
            <Button variant="outlined" onClick={() => setTryOnModalOpen(true)}>
              Try It On
            </Button>
          </FlexBox>

          {/* Try-On Modal */}
          <TryOnModal
            isOpen={isTryOnModalOpen}
            onClose={() => setTryOnModalOpen(false)}
            productId={typeof product.id === "string" ? parseInt(product.id, 10) : product.id} // Ensure productId is a number
            fetchAsset={(id) => Promise.resolve(`https://example.com/assets/${id}.glb`)}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProductIntro;
