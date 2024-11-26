import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Skeleton from "react-loading-skeleton";
import Button from "../components/buttons/Button";
import FlexBox from "../components/FlexBox";
import Grid from "../components/grid/Grid";
import DashboardLayout from "../components/layout/CustomerDashboardLayout";
import DashboardPageHeader from "../components/layout/DashboardPageHeader";
import Pagination from "../components/pagination/Pagination";
import ProductCard1 from "../components/product-cards/ProductCard1";
import { fetchWishlist } from "../redux/slices/wishlistSlice";
import { RootState } from "../redux/store";
import type { AppDispatch } from "../redux/store";
import type { PageWithLayout } from "../types/pageLayouts";
import { Product } from "@/types/Product";


const WishList: PageWithLayout = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items: wishlist, loading, error } = useSelector((state: RootState) => state.wishlist);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const itemsPerPage = 9;

  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedItems: Product[] = wishlist.slice(startIndex, endIndex);


  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  const handlePageChange = (selected: number) => {
    setCurrentPage(selected);
  };

  if (loading) {
    return (
      <div>
        {Array.from({ length: itemsPerPage }).map((_, index) => (
          <Skeleton key={index} height={250} width="100%" style={{ marginBottom: "1.25rem" }} />
        ))}
      </div>
    );
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!wishlist.length) {
    return <p>Your wishlist is empty.</p>;
  }

  return (
    <div>
      <DashboardPageHeader
        title="My Wish List"
        iconName="heart_filled"
        button={
          <Button color="primary" bg="primary.light" px="2rem">
            Add All to Cart
          </Button>
        }
      />

      <Grid container spacing={6}>
        {paginatedItems.map((item: Product) => (
          <Grid item lg={4} sm={6} xs={12} key={item.id}>
            <ProductCard1
              id={item.id}
              title={item.title}
              price={item.price}
              imgUrl={item.images?.[0] || "/assets/default-product.jpg"}
              category={item.category}
              images={item.images}
              brand={item.brand}
              stock={item.stock}
            />
          </Grid>
        ))}
      </Grid>

      <FlexBox justifyContent="center" mt="2.5rem">
        <Pagination
          pageCount={Math.ceil(wishlist.length / itemsPerPage)}
          onChange={({ selected }) => handlePageChange(selected)}
        />
      </FlexBox>
    </div>
  );
};

WishList.layout = DashboardLayout;

export default WishList;
