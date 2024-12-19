import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useInView } from "react-intersection-observer";
import { LazyLoadImage } from "react-lazy-load-image-component";
import Box from "../Box";
import Grid from "../grid/Grid";
import ProductCard1 from "../product-cards/ProductCard1";
import { H3 } from "../Typography";
import { fetchRelatedProducts } from "../../redux/slices/products/productSlice";
import { RootState } from "../../redux/store";
import type { AppDispatch } from "../../redux/store";
import Modal from "../modal/Modal";
import ProductIntro from "../products/ProductIntro";
import { Product } from "../../types/Product";

export interface RelatedProductsProps {
  productId: string;
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({ productId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { relatedProducts, loading, error } = useSelector((state: RootState) => state.products);
  const { currentRates } = useSelector((state: RootState) => state.exchangeRate); // Fetch exchange rates
  const [filters, setFilters] = useState({ brand: "", category: "", maxPrice: Infinity });
  const [page, setPage] = useState(1);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const { ref, inView } = useInView();

  useEffect(() => {
    if (productId) {
      dispatch(fetchRelatedProducts({ productId, filters, page }));
    }
  }, [dispatch, productId, filters, page]);

  useEffect(() => {
    if (inView && !loading) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [inView, loading]);

  const handleFilterChange = (key: string, value: string | number) => {
    setFilters((prevFilters) => ({ ...prevFilters, [key]: value }));
    setPage(1);
  };

  if (loading && page === 1) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="200px">
        <p>Loading related products...</p>
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="200px">
        <p>Error loading related products: {error}</p>
      </Box>
    );
  }

  if (!relatedProducts.length) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="200px">
        <p>No related products found.</p>
      </Box>
    );
  }

  return (
    <Box mb="3.75rem">
      <H3 mb="1.5rem">Related Products</H3>

      <Box mb="2rem" display="flex" justifyContent="space-between">
        <select onChange={(e) => handleFilterChange("brand", e.target.value)}>
          <option value="">All Brands</option>
          <option value="BrandA">Brand A</option>
          <option value="BrandB">Brand B</option>
        </select>

        <select onChange={(e) => handleFilterChange("category", e.target.value)}>
          <option value="">All Categories</option>
          <option value="CategoryA">Category A</option>
          <option value="CategoryB">Category B</option>
        </select>

        <input
          type="number"
          placeholder="Max Price"
          onChange={(e) => handleFilterChange("maxPrice", Number(e.target.value))}
        />
      </Box>

      <Grid container spacing={8}>
        {relatedProducts.map((item) => (
          <Grid item lg={3} md={4} sm={6} xs={12} key={item.id}>
            <ProductCard1
              id={item.id}
              title={item.title || "Untitled Product"}
              images={item.images || []}
              rating={
                typeof item.rating === "object" && "average" in item.rating
                  ? item.rating.average
                  : 0
              }
              brand={item.brand || "Unknown Brand"}
              category={item.category || "Uncategorized"}
              stock={item.stock ? true : false}
              hoverEffect={true}
              sellerPrice={item.sellerPrice || item.price || 0}
              buyerPrice={item.buyerPrice || item.price || 0}
              sellerCurrency={item.sellerCurrency || "USD"}
              buyerCurrency={item.buyerCurrency || "USD"}
              exchangeRates={currentRates || { baseCurrency: "USD", rates: {} }} // Pass exchange rates
            />
          </Grid>
        ))}
      </Grid>

      <div ref={ref}></div>

      {quickViewProduct && (
        <Modal open={!!quickViewProduct} onClose={() => setQuickViewProduct(null)}>
          <ProductIntro
            product={{
              ...quickViewProduct,
              images: quickViewProduct.images || [],
              title: quickViewProduct.title || "Untitled Product",
              description: quickViewProduct.description || "",
            }}
          />
        </Modal>
      )}
    </Box>
  );
};

export default RelatedProducts;
