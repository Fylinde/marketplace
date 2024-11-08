import React, { useEffect, useState } from "react";
import FlexBox from "../FlexBox";
import Grid from "../grid/Grid";
import Pagination from "../pagination/Pagination";
import ProductCard1 from "../product-cards/ProductCard1";
import { SemiSpan } from "../Typography";
import { getProducts } from "services/productService";
import { Product } from "types/Product";

export interface ProductCard1ListProps {
  products?: Product[]; // Accept products as an optional prop for flexibility
}

const ProductCard1List: React.FC<ProductCard1ListProps> = ({ products: initialProducts }) => {
  const [products, setProducts] = useState<Product[]>(initialProducts || []);
  const [currentPage, setCurrentPage] = useState(0);
  const productsPerPage = 9;

  useEffect(() => {
    if (!initialProducts) {
      // Fetch products if not provided as a prop
      getProducts(undefined, currentPage + 1)
        .then((response) => {
          setProducts(response.data.products);
        })
        .catch((error) => console.error("Failed to fetch products", error));
    }
  }, [currentPage, initialProducts]);

  const handlePageChange = (selectedPage: number) => {
    setCurrentPage(selectedPage);
  };

  return (
    <div>
      <Grid container spacing={6}>
        {products.map((product) => (
          <Grid item lg={4} sm={6} xs={12} key={product.id}>
            <ProductCard1
              id={product.id}
              title={product.title}
              price={product.price}
              imgUrl={product.imgUrl}
              category={product.category}
              images={product.images} // Pass images array if needed
              brand={product.brand}    // Optional, pass if available
              stock={product.stock}     // Optional, pass if available
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
          pageCount={Math.ceil(products.length / productsPerPage)}
          onChange={({ selected }: { selected: number }) => handlePageChange(selected)}
        />
      </FlexBox>
    </div>
  );
};

export default ProductCard1List;
