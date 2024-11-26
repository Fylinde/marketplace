import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductDetails, fetchRelatedProducts } from "@/redux/slices/productSlice";
import { RootState } from "@/redux/store";
import ProductReviews from "./ProductReviews";
import RelatedProducts from "./RelatedProducts";
import ProductTryOn from "./TryOnWidget";
import type { AppDispatch } from "../../redux/store"; 
import ProductDetailContainer from "./styles/ProductDetail.styles";

const ProductDetail: React.FC<{ productId: string }> = ({ productId }) => {
    const dispatch = useDispatch<AppDispatch>();
  const { currentProduct, loading, error } = useSelector((state: RootState) => state.products);

  useEffect(() => {
    dispatch(fetchProductDetails(productId));
    dispatch(fetchRelatedProducts({ productId }));
  }, [dispatch, productId]);

  if (loading) return <div>Loading product details...</div>;
  if (error) return <div>Error: {error}</div>;

  if (!currentProduct) return <div>Product not found</div>;

  return (
    <ProductDetailContainer>
      <h1>{currentProduct.name}</h1>
      <img src={currentProduct.imgUrl} alt={currentProduct.name} />
      <p>{currentProduct.description}</p>
      <p>Price: ${currentProduct.price}</p>
      <ProductReviews productId={productId} />
      <RelatedProducts productId={productId} />
      <ProductTryOn productId={productId} />
    </ProductDetailContainer>
  );
};

export default ProductDetail;
