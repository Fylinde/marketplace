import React, { useEffect, useState } from "react";
import FlexBox from "../FlexBox";
import Pagination from "../pagination/Pagination";
import ProductCard9 from "../product-cards/ProductCard9";
import { SemiSpan } from "../Typography";
import { getProducts } from "services/productService";
export interface ProductCard9ListProps {}

const ProductCard9List: React.FC<ProductCard9ListProps> = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const productsPerPage = 9; // Number of products per page

  useEffect(() => {
    // Fetch products from the backend
    getProducts()
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => console.error("Failed to fetch products", error));
  }, []);

  // Handle pagination
  const handlePageChange = (selectedPage: number) => {
    setCurrentPage(selectedPage);
  };

  // Calculate the products to display based on currentPage
  const displayedProducts = products.slice(
    currentPage * productsPerPage,
    (currentPage + 1) * productsPerPage
  );

  return (
    <div>
      {displayedProducts.map((item, ind) => (
        <ProductCard9 mb="1.25rem" key={item.id || ind} {...item} />
      ))}

      <FlexBox
        flexWrap="wrap"
        justifyContent="space-between"
        alignItems="center"
        mt="32px"
      >
        <SemiSpan>
          Showing {currentPage * productsPerPage + 1}-
          {Math.min((currentPage + 1) * productsPerPage, products.length)} of{" "}
          {products.length} Products
        </SemiSpan>
        <Pagination
          pageCount={Math.ceil(products.length / productsPerPage)}
          onChange={({ selected }) => handlePageChange(selected)}
        />
      </FlexBox>
    </div>
  );
};

export default ProductCard9List;
