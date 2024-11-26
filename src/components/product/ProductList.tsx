import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "@/redux/slices/productSlice";
import { RootState } from "@/redux/store";
import ProductCard from "./EnhancedProductCard";
import ProductListContainer from "./styles/ProductList.styles";
import type { AppDispatch } from "../../redux/store"; 

const ProductList: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
  const { products, loading, error, totalPages } = useSelector((state: RootState) => state.products);

  useEffect(() => {
    dispatch(fetchProducts({ page: 1 }));
  }, [dispatch]);

  if (loading) return <div>Loading products...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <ProductListContainer>
      {products.map((product) => (
        <ProductCard
          key={String(product.id)} // Ensure the key is a string
          productId={String(product.id)} // Convert product.id to a string
          buyerRegion="US"
          buyerCurrency="USD"
        />
      ))}
      <div className="pagination">
        {Array.from({ length: totalPages }).map((_, index) => (
          <button key={index} onClick={() => dispatch(fetchProducts({ page: index + 1 }))}>
            {index + 1}
          </button>
        ))}
      </div>
    </ProductListContainer>
  );
  
};

export default ProductList;
