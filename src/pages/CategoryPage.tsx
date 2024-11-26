import React, { useState } from "react";
import "./CategoryPage.css";

interface FilterOption {
  name: string;
  checked: boolean;
}

interface CategoryPageProps {
  filters?: {
    price: { min: number; max: number; step: number };
    brands: FilterOption[];
  };
  products: Array<{
    id: string | number;
    title: string;
    price: number;
    imgUrl: string;
  }>;
}

const CategoryPage: React.FC<CategoryPageProps> = ({
  filters = {
    price: { min: 0, max: 1000, step: 10 },
    brands: [
      { name: "Levi's", checked: false },
      { name: "Fylinde Essentials", checked: false },
      { name: "Wrangler", checked: false },
    ],
  },
  products,
}) => {
  const [priceRange, setPriceRange] = useState<number>(filters.price.max);
  const [selectedBrands, setSelectedBrands] = useState<FilterOption[]>(
    filters.brands
  );

  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPriceRange(Number(event.target.value));
  };

  const handleBrandChange = (brandName: string) => {
    setSelectedBrands((prevBrands) =>
      prevBrands.map((brand) =>
        brand.name === brandName ? { ...brand, checked: !brand.checked } : brand
      )
    );
  };

  const filteredProducts = products.filter((product) => {
    const matchesPrice = product.price <= priceRange;
    const matchesBrand =
      selectedBrands.every((brand) => !brand.checked) ||
      selectedBrands
        .filter((brand) => brand.checked)
        .some((brand) => product.title.includes(brand.name));
    return matchesPrice && matchesBrand;
  });

  return (
    <div className="category-page">
      <aside className="category-filters">
        <h3>Filters</h3>

        <div className="filter-group">
          <h4>Price</h4>
          <input
            type="range"
            min={filters.price.min}
            max={filters.price.max}
            step={filters.price.step}
            value={priceRange}
            onChange={handlePriceChange}
          />
          <p>Up to ${priceRange}</p>
        </div>

        <div className="filter-group">
          <h4>Brand</h4>
          {filters.brands.map((brand) => (
            <label key={brand.name}>
              <input
                type="checkbox"
                checked={brand.checked}
                onChange={() => handleBrandChange(brand.name)}
              />
              {brand.name}
            </label>
          ))}
        </div>
      </aside>

      <div className="category-products">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div className="product-card" key={product.id}>
              <img src={product.imgUrl} alt={product.title} />
              <h4>{product.title}</h4>
              <p>${product.price.toFixed(2)}</p>
            </div>
          ))
        ) : (
          <p>No products match the selected filters.</p>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
