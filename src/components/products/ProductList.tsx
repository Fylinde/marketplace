import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../redux/slices/products/productSlice";
import ProductCard1List from "./ProductCard1List";
import Pagination from "../pagination/Pagination";
import type { AppDispatch, RootState } from "../../redux/store"; // Ensure this matches your store setup

const ProductList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { products, totalPages, loading } = useSelector((state: RootState) => state.products);
  const [currentPage, setCurrentPage] = useState(1);

  
  useEffect(() => {
    // Pass sellerId inside filters to match the expected structure
    dispatch(fetchProducts({ filters: { sellerId: "" }, page: currentPage }));
  }, [dispatch, currentPage]);

  const handlePageChange = (selectedPage: number) => {
    setCurrentPage(selectedPage + 1); // Pagination uses zero-based index
  };

  if (loading) return <p>Loading products...</p>;

  return (
    <div>
      {/* Dynamically render ProductCard1List with fetched products */}
      <ProductCard1List products={products} />

      <Pagination
        pageCount={totalPages}
        onChange={({ selected }: { selected: number }) => handlePageChange(selected)}
      />
    </div>
  );
};

export default ProductList;
