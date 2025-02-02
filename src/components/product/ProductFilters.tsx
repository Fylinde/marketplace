import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, fetchTags } from "../../redux/slices/products/productSlice";
import { fetchCategories } from "../../redux/slices/products/categorySlice";
import { fetchBrands } from "../../redux/slices/products/brandSlice";
import type { AppDispatch, RootState } from "../../redux/store";
import ProductFiltersContainer from "./styles/ProductFilters.styles";

const ProductFilters: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { categories } = useSelector((state: RootState) => state.categories);
  const { brands } = useSelector((state: RootState) => state.brands);
  const { tags } = useSelector((state: RootState) => state.products);

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
      {/* Categories */}
      <select onChange={(e) => handleFilterChange({ category: e.target.value })}>
        <option value="">All Categories</option>
        {categories.map((category) => (
          <option key={category.id} value={category.title}>
            {category.title}
          </option>
        ))}
      </select>

      {/* Brands */}
      <select onChange={(e) => handleFilterChange({ brand: e.target.value })}>
        <option value="">All Brands</option>
        {brands.map((brand) => (
          <option key={brand.id} value={brand.name}>
            {brand.name}
          </option>
        ))}
      </select>

      {/* Tags */}
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
