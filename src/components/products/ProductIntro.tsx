import React, { useState, useCallback } from "react";
import Box from "../Box";
import Button from "../buttons/Button";
import Grid from "../grid/Grid";
import { H1, H2, H6, SemiSpan } from "../Typography";
import FlexBox from "../FlexBox";
import LazyImage from "../LazyImage";
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
    description?: string;
    buyerPrice: number;
    buyerCurrency: string;
    sellerPrice: number;
    sellerCurrency: string;
    stock: number;
    brand?: string;
    sellerId?: string;
    sellerName?: string;
  };
}

const ProductIntro: React.FC<ProductIntroProps> = ({ product }) => {
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [isTryOnModalOpen, setTryOnModalOpen] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  const { cartList } = useAppSelector((state) => state.cart);
  const recommendations = useAppSelector((state) => state.recommendation?.recommendations || []);
  const userContext = useAppSelector((state) => state.user?.context || "B2C");
  const { currentRates } = useAppSelector((state) => state.exchangeRate); // Fetch exchange rates

  const cartItem = cartList.find((item) => item.id === product.id);
  const images = product.images?.length ? product.images : ["/assets/images/default.png"];

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
              src={images[selectedImage]}
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
              (4 {getLocalizedText("reviews", "products")})
            </SemiSpan>
          </FlexBox>

          {/* Add to Cart and Try-On Section */}
          <FlexBox gap="1rem" mt="2rem">
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
          </FlexBox>
        </Grid>
      </Grid>

      {/* Recommendations Section */}
      <Box mt="3rem">
        <H6>{getLocalizedText("youMayAlsoLike", "products")}</H6>
        <FlexBox gap="1rem">
          {recommendations.map((recProduct: any) => (
            <ProductCard1
              key={recProduct.id}
              id={recProduct.id}
              name={recProduct.name || getLocalizedText("noName", "products")}
              images={recProduct.images || ["/assets/images/default.png"]}
              title={recProduct.title || "Untitled Product"}
              buyerPrice={recProduct.buyerPrice || 0}
              buyerCurrency={recProduct.buyerCurrency || "USD"}
              sellerPrice={recProduct.sellerPrice || 0}
              sellerCurrency={recProduct.sellerCurrency || "USD"}
              stock={recProduct.stock || 0}
              brand={recProduct.brand || getLocalizedText("unknownBrand", "products")}
              exchangeRates={currentRates || { baseCurrency: "USD", rates: {} }} // Add exchangeRates with fallback
            />
          ))}
        </FlexBox>
      </Box>

      {/* Try-On Modal */}
      <TryOnModal
        isOpen={isTryOnModalOpen}
        onClose={() => setTryOnModalOpen(false)}
        productId={typeof product.id === "string" ? parseInt(product.id, 10) : product.id}
        fetchAsset={(id) => Promise.resolve(`/assets/try-on/${id}.glb`)}
      />
    </Box>
  );
};

export default ProductIntro;
