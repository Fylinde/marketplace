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
import { useAppSelector, useAppDispatch } from "../../redux/reduxHooks";
import { getLocalizedText, formatCurrency } from "../../utils/localizationUtils";
import ProductCard1 from "../product-cards/ProductCard1";

export interface ProductIntroProps {
  product: {
    id: string | number;
    images: string[];
    title: string;
    description: string;
    buyerPrice: number;
    buyerCurrency: string;
    sellerPrice: number;
    sellerCurrency: string;
    stock: number;
    brand?: string;
    vendorId?: string;
    vendorName?: string;
  };
}

const ProductIntro: React.FC<ProductIntroProps> = ({ product }) => {
  const [selectedImage, setSelectedImage] = useState<number>(0); // Track selected image index
  const [isTryOnModalOpen, setTryOnModalOpen] = useState<boolean>(false); // Try-On modal state
  const dispatch = useAppDispatch();

  // Redux State
  const { cartList } = useAppSelector((state) => state.cart);
  const recommendations = useAppSelector(
    (state) => state.recommendation?.items || [] // Corrected property name to "items"
  );
  const userContext = useAppSelector(
    (state) => state.user?.context || "B2C" // Corrected property name to "context"
  );

  const cartItem = cartList.find((item) => item.id === product.id);

  const images = product.images?.length ? product.images : ["/assets/images/default.png"]; // Fallback image

  const handleImageClick = (index: number) => () => setSelectedImage(index);

  const handleCartAmountChange = useCallback(
    (amount: number) => {
      dispatch({
        type: "CHANGE_CART_AMOUNT",
        payload: {
          qty: amount,
          name: product.title,
          price: product.buyerPrice,
          imgUrl: product.images[selectedImage] || "/assets/images/default.png",
          id: product.id,
        },
      });
    },
    [dispatch, product, selectedImage]
  );

  const stockStatus = product.stock > 10 ? "In Stock" : product.stock > 0 ? "Few Left" : "Out of Stock";

  return (
    <Box overflow="hidden" p="20px">
      <Grid container spacing={3}>
        {/* Images Section */}
        <Grid item md={6} xs={12}>
          <FlexBox justifyContent="center" mb="30px">
            <LazyImage
              src={images[selectedImage]} // Selected image
              alt={product.title}
              height={400}
              width="auto"
            />
          </FlexBox>

          <FlexBox gap="10px" justifyContent="center">
            {images.map((url, index) => (
              <Box
                key={index}
                onClick={handleImageClick(index)}
                border={selectedImage === index ? "2px solid #007185" : "1px solid gray"}
                style={{ cursor: "pointer" }}
              >
                <Avatar src={url} size={50} />
              </Box>
            ))}
          </FlexBox>
        </Grid>

        {/* Info Section */}
        <Grid item md={6} xs={12}>
          <H1>{product.title}</H1>

          {/* Dual Pricing */}
          <H2>
            {formatCurrency(product.buyerPrice, product.buyerCurrency)} (
            {formatCurrency(product.sellerPrice, product.sellerCurrency)})
          </H2>
          <H6>
            {getLocalizedText("stockStatus", "products")}: {stockStatus}
          </H6>
          <SemiSpan>
            {getLocalizedText("brand", "products")}: {product.brand || getLocalizedText("unknown", "products")}
          </SemiSpan>
          <FlexBox alignItems="center" mt="1rem">
            <Rating value={4.5} outof={5} />
            <SemiSpan style={{ marginLeft: "8px" }}>
              ({4} {getLocalizedText("reviews", "products")})
            </SemiSpan>
          </FlexBox>

          {/* Description */}
          <Box mt="1rem" mb="1rem">
            <H6>{getLocalizedText("description", "products")}</H6>
            <SemiSpan>
              {product.description || getLocalizedText("noDescription", "products")}
            </SemiSpan>
          </Box>

          {/* Bulk Discounts for B2B */}
          {userContext === "B2B" && (
            <Box mt="1rem" mb="1rem">
              <H6>{getLocalizedText("bulkDiscounts", "products")}</H6>
              <ul>
                <li>
                  {getLocalizedText("quantityAbove", "products")}: 10 -{" "}
                  {formatCurrency(product.buyerPrice * 0.9, product.buyerCurrency)}
                </li>
                <li>
                  {getLocalizedText("quantityAbove", "products")}: 50 -{" "}
                  {formatCurrency(product.buyerPrice * 0.85, product.buyerCurrency)}
                </li>
                <li>
                  {getLocalizedText("quantityAbove", "products")}: 100 -{" "}
                  {formatCurrency(product.buyerPrice * 0.8, product.buyerCurrency)}
                </li>
              </ul>
            </Box>
          )}

          {/* Add to Cart and Try-On Section */}
          <FlexBox gap="1rem" mt="2rem">
            {userContext === "C2C" && product.vendorName && (
              <Box>
                <H6>
                  {getLocalizedText("soldBy", "products")}: {product.vendorName}
                </H6>
              </Box>
            )}
            <Button
              variant="contained"
              disabled={product.stock === 0}
              onClick={() => handleCartAmountChange(1)}
            >
              {getLocalizedText("addToCart", "products")}
            </Button>
            <Button variant="outlined" onClick={() => setTryOnModalOpen(true)}>
              {getLocalizedText("tryItOn", "products")}
            </Button>
            {userContext !== "B2C" && (
              <Button variant="contained" color="secondary">
                {getLocalizedText("payWithEscrow", "products")}
              </Button>
            )}
            {userContext !== "B2C" && (
              <Button variant="contained" color="primary">
                {getLocalizedText("payWithCrypto", "products")}
              </Button>
            )}
          </FlexBox>

          {/* Try-On Modal */}
          <TryOnModal
            isOpen={isTryOnModalOpen}
            onClose={() => setTryOnModalOpen(false)}
            productId={typeof product.id === "string" ? parseInt(product.id, 10) : product.id} // Fixed type error
            fetchAsset={(id) => Promise.resolve(`https://example.com/assets/${id}.glb`)}
          />
        </Grid>
      </Grid>

      {/* Recommendations Section */}
      <Box mt="3rem">
        <H6>{getLocalizedText("youMayAlsoLike", "products")}</H6>
        <FlexBox gap="1rem">
          {recommendations.map((recProduct: any) => (
            <ProductCard1 key={recProduct.id} product={recProduct} /> // Pass correct props to ProductCard1
          ))}
        </FlexBox>
      </Box>
    </Box>
  );
};

export default ProductIntro;
