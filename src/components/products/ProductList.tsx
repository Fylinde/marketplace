import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "redux/slices/reduxHooks";
import { fetchProducts } from "redux/slices/productSlice";
import ProductCard1List from "./ProductCard1List";
import Pagination from "../pagination/Pagination";
import { Product } from "types/Product";

const ProductList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { products, totalPages, loading } = useAppSelector((state) => state.products);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(fetchProducts({ page: currentPage, vendorId: '' }));
  }, [dispatch, currentPage]);

  const handlePageChange = (selectedPage: number) => {
    setCurrentPage(selectedPage);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      {/* Pass products as a prop to ProductCard1List for rendering */}
      <ProductCard1List products={products} />

      <Pagination
        pageCount={totalPages}
        onChange={({ selected }: { selected: number }) => handlePageChange(selected + 1)}
      />
    </div>
  );
};

export default ProductList;
