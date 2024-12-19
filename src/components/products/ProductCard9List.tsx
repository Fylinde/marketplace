import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Skeleton from "react-loading-skeleton";
import FlexBox from "../FlexBox";
import Pagination from "../pagination/Pagination";
import ProductCard9 from "../product-cards/ProductCard9";
import { SemiSpan } from "../Typography";
import { fetchProducts } from "../../redux/slices/products/productSlice";
import { updateFilters } from "../../redux/slices/support/filterSlice";
import { RootState } from "../../redux/store";
import type { AppDispatch } from "../../redux/store";
import { Product } from "../../types/Product";

export interface ProductCard9ListProps {
  sellerId?: string;
}

const ProductCard9List: React.FC<ProductCard9ListProps> = ({ sellerId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { products, loading, totalPages, error } = useSelector((state: RootState) => state.products);
  const filters = useSelector((state: RootState) => state.filters);
  const [currentPage, setCurrentPage] = useState(0);
  const productsPerPage = 9;
  const [sortOption, setSortOption] = useState<string>("popularity");

  useEffect(() => {
    const updatedFilters = { ...filters, ...(sellerId ? { sellerId } : {}) };
    dispatch(updateFilters(updatedFilters)); // Dispatch updated filters to Redux
    dispatch(fetchProducts({ page: currentPage + 1, filters: updatedFilters, sort: sortOption }));
  }, [currentPage, sellerId, dispatch, filters, sortOption]);

  const handlePageChange = (selectedPage: number) => {
    setCurrentPage(selectedPage);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSortOption = e.target.value;
    setSortOption(newSortOption);

    // Dispatch updated filters to the Redux store
    dispatch(updateFilters({ sort: newSortOption }));
  };

  const logProductInteraction = (productId: string | number) => {
    console.log(`Product ${productId} clicked`);
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
      <FlexBox justifyContent="space-between" mb="1.5rem">
        <select value={sortOption} onChange={handleSortChange}>
          <option value="popularity">Sort by Popularity</option>
          <option value="price_low_to_high">Sort by Price: Low to High</option>
          <option value="price_high_to_low">Sort by Price: High to Low</option>
          <option value="rating">Sort by Rating</option>
        </select>
      </FlexBox>

      {products.map((item: Product) => (
        <ProductCard9
          mb="1.25rem"
          key={item.id}
          id={item.id}
          title={item.title}
          sellerPrice={item.sellerPrice}
          buyerPrice={item.buyerPrice}
          sellerCurrency={item.sellerCurrency || "USD"}
          buyerCurrency={item.buyerCurrency || "USD"}
          images={item.images}
          rating={typeof item.rating === "object" ? item.rating.average : item.rating}
          brand={item.brand}
          description={item.description}
          category={item.category}
          stock={item.stock}
          onClick={() => logProductInteraction(item.id)}
        />
      ))}

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

export default ProductCard9List;
