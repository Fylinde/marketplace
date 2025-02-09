import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../redux/slices/products/productSlice";
import ProductCard from "./EnhancedProductCard";
import ProductListContainer from "./styles/ProductList.styles";
import type { AppDispatch, RootState } from "../../redux/store";

const ProductList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { products, loading, error, totalPages } = useSelector((state: RootState) => state.products);

  useEffect(() => {
    // Provide a default filters object with an empty object for filters
    dispatch(fetchProducts({ filters: {}, page: 1 }));
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
          sellerPrice={product.sellerPrice} // Ensure product has `sellerPrice`
          sellerCurrency={product.sellerCurrency} // Ensure product has `sellerCurrency`
          localizedPrices={product.localizedPrices} // Optional if available
          stock={product.stock} // Pass stock value
          recommendations={product.recommendations} // Optional if available
          communityQuestions={product.communityQuestions} // Optional if available
          trendingStats={product.trendingStats} // Optional if available
          tryOnAvailable={product.tryOnAvailable} // Optional if available
        />
      ))}
      <div className="pagination">
        {Array.from({ length: totalPages }).map((_, index) => (
          // Include a default filters object in pagination calls
          <button
            key={index}
            onClick={() => dispatch(fetchProducts({ filters: {}, page: index + 1 }))}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </ProductListContainer>
  );
};

export default ProductList;
