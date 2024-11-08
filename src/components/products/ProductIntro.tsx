import LazyImage from "components/LazyImage";
import { useAppContext } from "contexts/app/AppContext";
import { CartItem } from "reducers/cartReducer";
import { Link, useParams } from "react-router-dom"; 
import React, { useCallback, useEffect, useState } from "react";
import Avatar from "../avatar/Avatar";
import Box from "../Box";
import Button from "../buttons/Button";
import FlexBox from "../FlexBox";
import Grid from "../grid/Grid";
import Icon from "../icon/Icon";
import Rating from "../rating/Rating";
import { H1, H2, H3, H6, SemiSpan } from "../Typography";
import { getProducts, getProductRating } from "services/productService";

export interface ProductIntroProps {
  id?: string | number;
  imgUrl?: string[]; // Array to handle multiple images
  title: string;
  price: number;
  brand?: string; // Optional brand prop
  stock?: boolean; // Optional stock prop
}

const ProductIntro: React.FC<ProductIntroProps> = ({
  id: propId,
  imgUrl: propImgUrl,
  title: propTitle,
  price: propPrice,
  brand: propBrand,
  stock: propStock
}) => {
  const { id: paramId } = useParams<{ id: string }>();
  const id = propId || paramId;
  const [product, setProduct] = useState<any>(null);
  const [rating, setRating] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const { state, dispatch } = useAppContext();
  const cartList: CartItem[] = state.cart.cartList;

  useEffect(() => {
    if (id && !propId) {
      // Only fetch data if props were not passed
      getProducts()
        .then((response) => {
          const productData = response.data.find((prod: any) => prod.id === id);
          setProduct(productData);
        })
        .catch((error) => console.error("Failed to fetch product", error));
  
      getProductRating(String(id)) 
        .then((response) => setRating(response.data))
        .catch((error) => console.error("Failed to fetch rating", error));
    } else if (propId) {
      // Use props if provided
      setProduct({
        id: propId,
        images: propImgUrl,
        title: propTitle,
        price: propPrice,
        brand: propBrand,
        stock: propStock,
      });
    }
  }, [id, propId, propImgUrl, propTitle, propPrice, propBrand, propStock]);
  

  const cartItem = cartList.find((item) => item.id === id);
  const handleImageClick = (ind: number) => () => setSelectedImage(ind);

  const handleCartAmountChange = useCallback(
    (amount: number) => () => {
      if (product) {
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
      }
    },
    [dispatch, product, selectedImage]
  );

  if (!product) return <p>Loading...</p>;

  return (
    <Box overflow="hidden">
      <Grid container justifyContent="center" spacing={16}>
        <Grid item md={6} xs={12} alignItems="center">
          <Box>
            <FlexBox justifyContent="center" mb="50px">
              <LazyImage
                src={product.images[selectedImage] || "/assets/images/default.png"}
                alt={product.title}
                height={300}
                width="auto"
                loading="eager"
                style={{ objectFit: "contain" }}
              />
            </FlexBox>
            <FlexBox overflow="auto">
              {product.images?.length > 0 ? (
                product.images.map((url: string, ind: number) => (
                  <Box
                    size={70}
                    minWidth={70}
                    bg="white"
                    borderRadius="10px"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    cursor="pointer"
                    border="1px solid"
                    key={ind}
                    ml={ind === 0 ? "auto" : undefined}
                    mr={ind === product.images.length - 1 ? "auto" : "10px"}
                    borderColor={selectedImage === ind ? "primary.main" : "gray.400"}
                    onClick={handleImageClick(ind)}
                  >
                    <Avatar src={url} borderRadius="10px" size={40} />
                  </Box>
                ))
              ) : (
                <Box>No Images Available</Box>
              )}
            </FlexBox>
          </Box>
        </Grid>

        <Grid item md={6} xs={12} alignItems="center">
          <H1 mb="1rem">{product.title}</H1>
          <FlexBox alignItems="center" mb="1rem">
            <SemiSpan>Brand:</SemiSpan>
            <H6 ml="8px">{product.brand || "Unknown"}</H6>
          </FlexBox>

          <FlexBox alignItems="center" mb="1rem">
            <SemiSpan>Rated:</SemiSpan>
            <Box ml="8px" mr="8px">
              <Rating color="warn" value={rating?.average || 0} outof={5} />
            </Box>
            <H6>({rating?.count || 0} reviews)</H6>
          </FlexBox>

          <Box mb="24px">
            <H2 color="primary.main" mb="4px" lineHeight="1">
              ${product.price.toFixed(2)}
            </H2>
            <SemiSpan color="inherit">{product.stock ? "Stock Available" : "Out of Stock"}</SemiSpan>
          </Box>

          {!cartItem?.qty ? (
            <Button
              variant="contained"
              size="small"
              color="primary"
              mb="36px"
              onClick={handleCartAmountChange(1)}
            >
              Add to Cart
            </Button>
          ) : (
            <FlexBox alignItems="center" mb="36px">
              <Button
                p="9px"
                variant="outlined"
                size="small"
                color="primary"
                onClick={handleCartAmountChange(cartItem.qty - 1)}
              >
                <Icon variant="small">minus</Icon>
              </Button>
              <H3 fontWeight="600" mx="20px">
                {String(cartItem.qty).padStart(2, "0")}
              </H3>
              <Button
                p="9px"
                variant="outlined"
                size="small"
                color="primary"
                onClick={handleCartAmountChange(cartItem.qty + 1)}
              >
                <Icon variant="small">plus</Icon>
              </Button>
            </FlexBox>
          )}
          
          <FlexBox alignItems="center" mb="1rem">
            <SemiSpan>Sold By:</SemiSpan>
            <Link to={`/vendor/${product.vendorId}`}>
              <H6 lineHeight="1" ml="8px">
                {product.vendorName || "Unknown"}
              </H6>
            </Link>
          </FlexBox>

          <Box mt="2rem">
            <H2 mb="1rem">Customer Reviews</H2>
            {rating?.reviews?.length > 0 ? (
              rating.reviews.map((review: any, index: number) => (
                <Box key={index} mb="1rem">
                  <FlexBox alignItems="center" mb="0.5rem">
                    <Rating color="warn" value={review.rating} outof={5} />
                    <SemiSpan ml="1rem">{review.comment}</SemiSpan>
                  </FlexBox>
                  <SemiSpan color="gray.600">
                    Reviewed by {review.userId} on {new Date(review.date).toLocaleDateString()}
                  </SemiSpan>
                </Box>
              ))
            ) : (
              <SemiSpan color="gray.600">No reviews available</SemiSpan>
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProductIntro;
