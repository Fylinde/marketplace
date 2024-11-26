import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";
import { useParams } from "react-router-dom";
import { RootState } from "../redux/store";
import { fetchProducts } from "../redux/slices/productSlice";
import ProductIntro from "../components/products/ProductIntro";
import ProductDescription from "../components/products/ProductDescription";
import FrequentlyBought from "../components/products/FrequentlyBought";
import RelatedProducts from "../components/products/RelatedProducts";
import AvailableShops from "../components/products/AvailableShops";
import TryOnButton from "../components/TryOn/TryOnButton";
import TryOnModal from "../components/TryOn/TryOnModal";
import {
  ProductDetailContainer,
  ProductInfo,
  SectionTitle,
  ActionButton,
  ContactSeller,
  ContactButton,
  ImageGalleryWrapper,
} from "./StyledProductDetailPage";
import ImageGallery from "react-image-gallery";

// Define Product interface (this should match your Redux state)
interface Product {
  id?: string | number;
  title: string;
  price: number;
  off?: number;
  images: string[];
  category?: string;
  brand?: string;
  stock?: boolean;
  rating?: {
    average: number;
    count: number;
  }
}
const fetchAsset = async (productId: number): Promise<string> => {
  return `https://example.com/assets/${productId}.glb`;
};

const ProductDetailPage: React.FC = () => {
  const { productId, vendorId } = useParams<{ productId: string; vendorId: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { products, loading, error } = useSelector((state: RootState) => state.products);
  const [isTryOnModalOpen, setTryOnModalOpen] = useState(false);

  // Find product with explicit type
  const product = products.find((prod: Product) => String(prod.id) === productId);

  // Fetch products if not already loaded
  useEffect(() => {
    if (vendorId && !product) {
      dispatch(fetchProducts({ vendorId, page: 1 }));
    }
  }, [vendorId, productId, dispatch, product]);

  // Render loading, error, or missing product states
  if (loading) return <p>Loading product...</p>;
  if (error) return <p>{error}</p>;
  if (!product) return <p>Product not found</p>;

  return (
    <ProductDetailContainer>
      <ImageGalleryWrapper>
        <ImageGallery
          items={(product.images || []).map((image: string) => ({
            original: image,
            thumbnail: image,
          }))}
        />
      </ImageGalleryWrapper>

      <ProductInfo>
        <ProductIntro product={product} />
        <ProductDescription description={product.description} />
        <div>
          <ActionButton>Buy It Now</ActionButton>
          <ActionButton>Add to Cart</ActionButton>
          <ActionButton>Make Offer</ActionButton>
        </div>
        <div>
          <SectionTitle>Try On This Product</SectionTitle>
          <TryOnButton onClick={() => setTryOnModalOpen(true)} />
        </div>
        <ContactSeller>
          <SectionTitle>Contact Seller</SectionTitle>
          <ContactButton>Chat with Seller</ContactButton>
          <ContactButton>WhatsApp</ContactButton>
          <ContactButton>Call Seller</ContactButton>
        </ContactSeller>
      </ProductInfo>

      <FrequentlyBought productId={String(product.id)} />
      <RelatedProducts productId={String(product.id)} />
      <AvailableShops productId={String(product.id)} />

      <TryOnModal
        isOpen={isTryOnModalOpen}
        onClose={() => setTryOnModalOpen(false)}
        productId={Number(product.id)} // Convert to number
        fetchAsset={fetchAsset}
      />
    </ProductDetailContainer>
  );
};

export default ProductDetailPage;
