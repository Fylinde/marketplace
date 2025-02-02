import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import FlexBox from "../FlexBox";
import Hidden from "../hidden/Hidden";
import DashboardPageHeader from "../layout/DashboardPageHeader";
import Pagination from "../pagination/Pagination";
import TableRow from "../TableRow";
import { H5 } from "../Typography";
import OrderRow from "./OrderRow";
import { fetchOrders, setFilters, setSort } from "../../redux/slices/orders/orderSlice";
import type { AppDispatch, RootState } from "../../redux/store";


const CustomerOrderList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    orders,
    totalPages,
    currentPage,
    loading,
    filters,
    sort,
  } = useSelector((state: RootState) => state.orders);

  useEffect(() => {
    dispatch(fetchOrders({ page: currentPage, filters, sort }));
  }, [dispatch, currentPage, filters, sort]);

  const handlePageChange = (page: number) => {
    dispatch(fetchOrders({ page, filters, sort }));
  };

  const handleSortChange = (sortOption: "date" | "total" | "customerName") => {
    dispatch(setSort(sortOption));
  };

  return (
    <div>
      <DashboardPageHeader title="My Orders" iconName="bag_filled" />
      <p style={{ marginBottom: "1rem", color: "#666" }}>
        Track your orders, manage refunds, and view order details.
      </p>

      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
        <select onChange={(e) => handleSortChange(e.target.value as "date" | "total" | "customerName")}>
          <option value="date">Sort by Date</option>
          <option value="total">Sort by Total</option>
          <option value="customerName">Sort by Customer Name</option>
        </select>
      </div>

      <Hidden down={769}>
        <TableRow padding="0px 18px" boxShadow="none" bg="none">
          <H5 color="text.muted" my="0px" mx="6px" textAlign="left">
            Order #
          </H5>
          <H5 color="text.muted" my="0px" mx="6px" textAlign="left">
            Status
          </H5>
          <H5 color="text.muted" my="0px" mx="6px" textAlign="left">
            Date Purchased
          </H5>
          <H5 color="text.muted" my="0px" mx="6px" textAlign="left">
            Buyer Total
          </H5>
          <H5 color="text.muted" my="0px" mx="6px" textAlign="left">
            Seller Total
          </H5>
        </TableRow>
      </Hidden>

      {loading ? (
        <p>Loading orders...</p>
      ) : (
        orders.map((order, index) => (
          <OrderRow
            orderData={{
              id: order.id,
              status: order.status,
              createdAt: order.createdAt || "N/A", // Handle missing createdAt
              buyerCurrency: order.buyerCurrency,
              totalBuyerPrice: order.totalBuyerPrice,
              sellerCurrency: order.sellerCurrency,
              totalSellerPrice: order.totalSellerPrice,
            }}
            key={index}
          />
        ))
      )}

      <FlexBox justifyContent="center" mt="2.5rem">
        <Pagination
          pageCount={totalPages}
          onChange={({ selected }) => handlePageChange(selected + 1)}
          forcePage={currentPage - 1}
        />
      </FlexBox>
    </div>
  );
};

export default CustomerOrderList;