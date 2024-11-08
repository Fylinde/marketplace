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
import { fetchProducts } from "redux/slices/productSlice";
import { RootState, AppDispatch } from "redux/store";

// Define the Product interface here if it’s not defined elsewhere
interface Product {
  id: string;
  title: string;
  price: number;
  createdAt: string;
  status?: string;
  // Add other fields as needed
}

export interface VendorProductListProps {
  vendorId: string;
}

const VendorProductList: React.FC<VendorProductListProps> = ({ vendorId }) => {
  const dispatch: AppDispatch = useDispatch();
  const { products, loading, error, totalPages } = useSelector((state: RootState) => state.products);
  const buttonSize: "small" = "small"; // Strongly type the value

  useEffect(() => {
    // Fetch products for the specific vendor
    dispatch(fetchProducts({ vendorId, page: 1 })); // Start with page 1
  }, [dispatch, vendorId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <Fragment>
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

      {products.map((item: Product) => (
        <Link to={`/vendor/products/${item.id}`} key={item.id} style={{ textDecoration: 'none', color: 'inherit' }}>
          <TableRow my="1rem" padding="6px 18px">
            <H5 m="6px" textAlign="left">
              {item.id}
            </H5>
            <Typography m="6px" textAlign="left" color="text.muted">
              {item.status || "Available"}
            </Typography>
            <Typography m="6px" textAlign="left" color="text.muted">
              {new Date(item.createdAt).toLocaleDateString()}
            </Typography>
            <Typography m="6px" textAlign="left" color="text.muted">
              ${item.price}
            </Typography>

            <Hidden flex="0 0 0 !important" down={769}>
              <Typography textAlign="center" color="text.muted">
                <IconButton size={buttonSize}>
                  <Icon variant="small" defaultcolor="currentColor">
                    arrow-right
                  </Icon>
                </IconButton>
              </Typography>
            </Hidden>
          </TableRow>
        </Link>
      ))}

      <FlexBox justifyContent="center" mt="2.5rem">
        <Pagination
          pageCount={totalPages}
          onChange={(data) => {
            dispatch(fetchProducts({ vendorId, page: data.selected + 1 }));
          }}
        />
      </FlexBox>
    </Fragment>
  );
};

export default VendorProductList;
