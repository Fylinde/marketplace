import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Skeleton from "react-loading-skeleton";
import FlexBox from "../FlexBox";
import Grid from "../grid/Grid";
import Pagination from "../pagination/Pagination";
import ProductCard1 from "../product-cards/ProductCard1";
import { SemiSpan } from "../Typography";
import { fetchProducts } from "../../redux/slices/products/productSlice";
import { RootState } from "../../redux/store";
import type { AppDispatch } from "../../redux/store";
import { Product } from "../../types/Product";

export interface ProductCard1ListProps {
  vendorId?: string;
  products?: Product[];
}

const ProductCard1List: React.FC<ProductCard1ListProps> = ({ vendorId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { products, loading, totalPages, error } = useSelector((state: RootState) => state.products);
  const [currentPage, setCurrentPage] = useState(0);
  const productsPerPage = 9;

  useEffect(() => {
    dispatch(fetchProducts({ page: currentPage + 1, filters: { ...(vendorId ? { vendorId } : {}) } }));
  }, [currentPage, vendorId, dispatch]);

  const handlePageChange = (selectedPage: number) => {
    setCurrentPage(selectedPage);
  };

  if (loading) {
    return (
      <div>
        {Array.from({ length: productsPerPage }).map((_, index) => (
          <Skeleton key={index} height={250} width="100%" style={{ marginBottom: "1.25rem" }} />
        ))}
      </div>
    );
  }

  if (error) {
    return <p>Error loading products: {error}</p>;
  }

  if (!products.length) {
    return <p>No products found.</p>;
  }

  return (
    <div>
      <Grid container spacing={6}>
        {products.map((product: Product) => (
          <Grid item lg={4} sm={6} xs={12} key={product.id}>
            <ProductCard1
              id={product.id}
              title={product.title}
              price={product.price}
              imgUrl={product.images?.[0] || "/assets/default-product.jpg"} // Fallback image
              category={product.category}
              images={product.images}
              brand={product.brand}
              stock={product.stock > 0} // Convert stock number to boolean
              sellerPrice={product.price} // Adjust this logic as needed
              buyerPrice={product.price} // Adjust this logic as needed
              sellerCurrency="USD" // Adjust this based on product data
              buyerCurrency="USD" // Adjust this based on product data
            />
          </Grid>
        ))}
      </Grid>

      <FlexBox flexWrap="wrap" justifyContent="space-between" alignItems="center" mt="32px">
        <SemiSpan>
          Showing {currentPage * productsPerPage + 1}-
          {Math.min((currentPage + 1) * productsPerPage, products.length)} of {products.length} Products
        </SemiSpan>
        <Pagination
          pageCount={totalPages}
          onChange={({ selected }: { selected: number }) => handlePageChange(selected)}
        />
      </FlexBox>
    </div>
  );
};

export default ProductCard1List;
