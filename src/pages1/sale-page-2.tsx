import productDatabase from "data/product-database";
import React, { useEffect, useState } from "react";
import Container from "../components/Container";
import FlexBox from "../components/FlexBox";
import Grid from "../components/grid/Grid";
import SaleLayout2 from "../components/layout/SaleLayout2";
import Pagination from "../components/pagination/Pagination";
import ProductCard1 from "../components/product-cards/ProductCard1";
import { SemiSpan } from "../components/Typography";

// Define the product structure based on the productDatabase entries
interface Product {
  price: number;
  title: string;
  imgUrl: string;
  category: string;
  id: string;
  subcategory?: string;
}

const SalePage2 = () => {
  const productPerPage = 28;

  // Use Product[] type for the product list
  const [productList, setProductList] = useState<Product[]>([]);
  const [page, setPage] = useState(0);

  // Handle page change
  const handlePageChange = ({ selected }: { selected: number }) => {
    console.log(selected);
    setPage(selected);
  };

  // Render the product count
  const renderProductCount = () => {
    let startNumber = page * productPerPage;
    let endNumber = (page + 1) * productPerPage;
    let totalProduct = productDatabase.length;

    if (endNumber > totalProduct) endNumber = totalProduct;

    return `Showing ${startNumber + 1}-${endNumber} of ${totalProduct} products`;
  };

  // UseEffect to update the product list based on the current page
  useEffect(() => {
    // Slice the products for pagination and set the product list
    const slicedProducts: Product[] = productDatabase.slice(
      page * productPerPage,
      (page + 1) * productPerPage
    );

    setProductList(slicedProducts);
  }, [page]);

  return (
    <Container mt="2rem">
      <Grid container spacing={6}>
        {productList.map((item, ind) => (
          <Grid item lg={3} md={4} sm={6} xs={12} key={ind}>
            {/* Spread the item properties into ProductCard1 */}
            <ProductCard1 {...item} />
          </Grid>
        ))}
      </Grid>

      <FlexBox
        flexWrap="wrap"
        justifyContent="space-between"
        alignItems="center"
        my="4rem"
      >
        <SemiSpan>{renderProductCount()}</SemiSpan>
        <Pagination
          pageCount={Math.ceil(productDatabase.length / productPerPage)}
          onChange={handlePageChange}
        />
      </FlexBox>
    </Container>
  );
};

// Set the layout for the page
SalePage2.layout = SaleLayout2;

export default SalePage2;
