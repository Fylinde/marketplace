import { Link } from "react-router-dom";
import React, { useEffect, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import IconButton from "../buttons/IconButton";
import FlexBox from "../FlexBox";
import Hidden from "../hidden/Hidden";
import Icon from "../icon/Icon";
import Pagination from "../pagination/Pagination";
import TableRow from "../TableRow";
import Typography, { H5 } from "../Typography";
import { fetchProducts } from "../../redux/slices/products/productSlice"; // Adjust import path as needed
import { RootState } from "../../redux/store";
import type { AppDispatch } from "../../redux/store";
import { Product } from "../../types/Product";


// Props for VendorProductList
export interface VendorProductListProps {
  sellerId: string;
}

const VendorProductList: React.FC<VendorProductListProps> = ({ sellerId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { products, loading, error, totalPages } = useSelector((state: RootState) => state.products);
  const buttonSize: "small" = "small";

  // Fetch products for the specific vendor
  useEffect(() => {
    dispatch(fetchProducts({ sellerId, page: 1 }));
  }, [dispatch, sellerId]);

  // Handle pagination changes
  const handlePageChange = (data: { selected: number }) => {
    dispatch(fetchProducts({ sellerId, page: data.selected + 1 }));
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error.main">{error}</Typography>;
  if (!products.length) return <Typography>No products found.</Typography>;


  return (
    <Fragment>
      {/* Header Row for Desktop */}
      <Hidden down={769}>
        <TableRow padding="0px 18px" boxShadow="none">
          <H5 color="text.muted" my="0px" mx="6px" textAlign="left">
            Product ID
          </H5>
          <H5 color="text.muted" my="0px" mx="6px" textAlign="left">
            Status
          </H5>
          <H5 color="text.muted" my="0px" mx="6px" textAlign="left">
            Date Added
          </H5>
          <H5 color="text.muted" my="0px" mx="6px" textAlign="left">
            Price
          </H5>
          <H5 flex="0 0 0 !important" color="text.muted" px="22px" my="0px"></H5>
        </TableRow>
      </Hidden>

      {/* Product List */}
      {products.map((item: Product) => (
        <Link
          to={`/vendor/products/${item.id}`}
          key={item.id}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <TableRow my="1rem" padding="6px 18px">
            <H5>{item.id}</H5>
            <Typography>{item.status || "Available"}</Typography>
            <Typography>{new Date(item.createdAt).toLocaleDateString()}</Typography>
            <Typography>${item.buyerPrice?.toFixed(2) || item.sellerPrice?.toFixed(2) || 0}</Typography>
          </TableRow>
        </Link>
      ))}

      {/* Pagination */}
      <FlexBox justifyContent="center" mt="2.5rem">
        <Pagination pageCount={totalPages} onChange={handlePageChange} />
      </FlexBox>
    </Fragment>
  );
};

export default VendorProductList;
