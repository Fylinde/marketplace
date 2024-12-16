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
import {
  fetchWishlist,
  removeFromWishlist,
  fetchRecommendations,
} from "../redux/slices/orders/wishlistSlice";
import { RootState } from "../redux/store";
import type { AppDispatch } from "../redux/store";
import type { PageWithLayout } from "../types/pageLayouts";
import { Product } from "@/types/Product";

const WishList: PageWithLayout = () => {
  const dispatch = useDispatch<AppDispatch>();

  // State from Redux
  const { items: wishlist, recommendations, loading, error } = useSelector(
    (state: RootState) => state.wishlist
  );

  const [currentPage, setCurrentPage] = useState<number>(0);
  const itemsPerPage = 9;

  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedItems: Product[] = wishlist.slice(startIndex, endIndex);

  // Fetch wishlist and recommendations on mount
  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  // Fetch personalized recommendations when wishlist changes
  useEffect(() => {
    if (wishlist.length > 0) {
      dispatch(fetchRecommendations(wishlist));
    }
  }, [wishlist, dispatch]);

  // Handle page change
  const handlePageChange = (selected: number) => {
    setCurrentPage(selected);
  };

  // Remove item from wishlist
  const handleRemoveItem = (itemId: string) => {
    dispatch(removeFromWishlist(itemId));
  };

  // Add all items to cart (Dummy implementation)
  const handleAddAllToCart = () => {
    alert("All items added to cart!");
  };

  // Render Loading State
  if (loading) {
    return (
      <div>
        {Array.from({ length: itemsPerPage }).map((_, index) => (
          <Skeleton key={index} height={250} width="100%" style={{ marginBottom: "1.25rem" }} />
        ))}
      </div>
    );
  }

  // Render Error State
  if (error) {
    return <p>Error: {error}</p>;
  }

  // Render Empty Wishlist State
  if (!wishlist.length) {
    return <p>Your wishlist is empty.</p>;
  }

  return (
    <div>
      <DashboardPageHeader
        title="My Wish List"
        iconName="heart_filled"
        button={
          <Button color="primary" bg="primary.light" px="2rem" onClick={handleAddAllToCart}>
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
              stock={item.stock > 0} // Convert stock to boolean
              sellerPrice={item.price} // Assuming sellerPrice is equal to item.price
              buyerPrice={item.price} // Assuming buyerPrice is equal to item.price
              sellerCurrency="USD" // Default currency
              buyerCurrency="USD" // Default currency
            />

            <FlexBox justifyContent="space-between" mt="0.5rem">
              <Button
                variant="outlined"
                color="secondary"
                size="small"
                onClick={() => handleRemoveItem(item.id)}
              >
                Remove
              </Button>
              <Button variant="outlined" color="primary" size="small">
                Add Note
              </Button>
            </FlexBox>
          </Grid>

        ))}
      </Grid>

      <FlexBox justifyContent="center" mt="2.5rem">
        <Pagination
          pageCount={Math.ceil(wishlist.length / itemsPerPage)}
          onChange={({ selected }) => handlePageChange(selected)}
        />
      </FlexBox>

      {/* Recommendations Section */}
      {recommendations.length > 0 && (
        <div>
          <h3>Recommended for You</h3>
          <Grid container spacing={6}>
            {recommendations.slice(0, 6).map((product: Product) => (
              <Grid item lg={4} sm={6} xs={12} key={product.id}>
                <ProductCard1
                  id={product.id}
                  title={product.title}
                  price={product.price}
                  imgUrl={product.images?.[0] || "/assets/default-product.jpg"}
                  category={product.category}
                  images={product.images}
                  brand={product.brand}
                  stock={product.stock > 0} // Converts stock to boolean
                  sellerPrice={product.price}
                  buyerPrice={product.price}
                  sellerCurrency="USD"
                  buyerCurrency="USD"
                />
              </Grid>


            ))}
          </Grid>
        </div>
      )}
    </div>
  );
};

WishList.layout = ({ children }) => <DashboardLayout>{children}</DashboardLayout>;


export default WishList;
