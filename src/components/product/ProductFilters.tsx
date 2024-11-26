import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, fetchCategories, fetchBrands, fetchTags } from "@/redux/slices/productSlice";
import { RootState } from "@/redux/store";
import type { AppDispatch } from "../../redux/store"; 
import ProductFiltersContainer from "./styles/ProductFilters.styles";

const ProductFilters: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
  const { categories, brands, tags } = useSelector((state: RootState) => state.products);

  React.useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchBrands());
    dispatch(fetchTags());
  }, [dispatch]);

  const handleFilterChange = (filters: Record<string, any>) => {
    dispatch(fetchProducts({ filters }));
  };

  return (
    <ProductFiltersContainer>
      <h3>Filter Products</h3>
      <select onChange={(e) => handleFilterChange({ category: e.target.value })}>
        <option value="">All Categories</option>
        {categories.map((category) => (
          <option key={category.title} value={category.title}>
            {category.title}
          </option>
        ))}
      </select>

      <select onChange={(e) => handleFilterChange({ brand: e.target.value })}>
        <option value="">All Brands</option>
        {brands.map((brand) => (
          <option key={brand} value={brand}>
            {brand}
          </option>
        ))}
      </select>

      <select onChange={(e) => handleFilterChange({ tag: e.target.value })}>
        <option value="">All Tags</option>
        {tags.map((tag) => (
          <option key={tag} value={tag}>
            {tag}
          </option>
        ))}
      </select>
    </ProductFiltersContainer>
  );
};

export default ProductFilters;
