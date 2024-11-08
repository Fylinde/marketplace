import React, { useEffect, useState } from "react";
import FlexBox from "../FlexBox";
import Hidden from "../hidden/Hidden";
import DashboardPageHeader from "../layout/DashboardPageHeader";
import Pagination from "../pagination/Pagination";
import TableRow from "../TableRow";
import { H5 } from "../Typography";
import OrderRow from "./OrderRow";

export interface CustomerOrderListProps {}

const CustomerOrderList: React.FC<CustomerOrderListProps> = () => {
  const [orderList, setOrderList] = useState([]);
  const [pageCount, setPageCount] = useState(5); // Update as needed

  // Fetch order data on component mount
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/customer/orders"); // Replace with actual API endpoint
        const data = await response.json();
        setOrderList(data.orders);
        setPageCount(data.pageCount); // Assume response includes page count
      } catch (error) {
        console.error("Failed to fetch orders", error);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div>
      <DashboardPageHeader title="My Orders" iconName="bag_filled" />

      <Hidden down={769}>
        <TableRow padding="0px 18px" boxShadow="none" bg="none">
          <H5 color="text.muted" my="0px" mx="6px" textAlign="left">
            Order #
          </H5>
          <H5 color="text.muted" my="0px" mx="6px" textAlign="left">
            Status
          </H5>
          <H5 color="text.muted" my="0px" mx="6px" textAlign="left">
            Date purchased
          </H5>
          <H5 color="text.muted" my="0px" mx="6px" textAlign="left">
            Total
          </H5>
          <H5
            flex="0 0 0 !important"
            color="text.muted"
            px="22px"
            my="0px"
          ></H5>
        </TableRow>
      </Hidden>

      {orderList.map((order, ind) => (
        <OrderRow orderData={order} key={ind} /> // Rename `item` to `orderData`
      ))}

      <FlexBox justifyContent="center" mt="2.5rem">
        <Pagination
          pageCount={pageCount}
          onChange={(data) => {
            console.log(data.selected);
          }}
        />
      </FlexBox>
    </div>
  );
};

export default CustomerOrderList;
