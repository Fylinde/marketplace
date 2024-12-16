import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchOrders,
  updateOrderStatus,
  setFilters,
  setSort,
} from "../../../redux/slices/orders/orderSlice";
import { getLocalizedText } from "../../../utils/localizationUtils";
import type { AppDispatch, RootState } from "../../../redux/store";
import {
  BulkOrderContainer,
  PageHeader,
  FiltersContainer,
  OrdersTable,
  BulkActionButton,
  LoadingMessage,
  ErrorMessage,
} from "./styles/BulkOrderProcessingStyles";

const BulkOrderProcessing = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { orders, loading, filters, sort, error } = useSelector(
    (state: RootState) => state.orders
  );
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);

  const statusMap: Record<string, "Pending" | "Processing" | "Delivered" | "Cancelled" | "Completed" | "Refunded"> = {
    pending: "Pending",
    shipped: "Processing",
    delivered: "Delivered",
    cancelled: "Cancelled",
  };

  useEffect(() => {
    dispatch(fetchOrders({ page: 1, filters, sort }));
  }, [dispatch, filters, sort]);

  const handleSelectOrder = (orderId: string) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleBulkStatusUpdate = async (statusKey: string) => {
    const status = statusMap[statusKey];
    if (!status) {
      alert(getLocalizedText("invalidStatus", "bulkOrderProcessing"));
      return;
    }

    if (selectedOrders.length === 0) {
      alert(getLocalizedText("noOrdersSelected", "bulkOrderProcessing"));
      return;
    }

    try {
      for (const orderId of selectedOrders) {
        await dispatch(updateOrderStatus({ orderId, status })).unwrap();
      }
      alert(getLocalizedText("statusUpdated", "bulkOrderProcessing"));
      setSelectedOrders([]);
    } catch (error) {
      const errorMessage = (error as Error)?.message || getLocalizedText("unknownError", "common");
      alert(getLocalizedText("bulkUpdateFailed", "bulkOrderProcessing", { error: errorMessage }));
    }
  };

  const handleFilterChange = (filterKey: string, value: string) => {
    dispatch(setFilters({ ...filters, [filterKey]: value }));
  };

  const handleSortChange = (sortKey: string) => {
    dispatch(setSort(sortKey as "date" | "total" | "customerName"));
  };

  if (loading) return <LoadingMessage>{getLocalizedText("loading", "common")}</LoadingMessage>;
  if (error)
    return (
      <ErrorMessage>
        {getLocalizedText("errorFetchingOrders", "bulkOrderProcessing", {
          error,
        })}
      </ErrorMessage>
    );

  return (
    <BulkOrderContainer>
      <PageHeader>{getLocalizedText("bulkOrderProcessing", "bulkOrderProcessing")}</PageHeader>
      <FiltersContainer>
        <label>
          {getLocalizedText("filterByStatus", "bulkOrderProcessing")}
          <select onChange={(e) => handleFilterChange("status", e.target.value)}>
            <option value="">{getLocalizedText("all", "common")}</option>
            <option value="pending">{getLocalizedText("pending", "bulkOrderProcessing")}</option>
            <option value="shipped">{getLocalizedText("shipped", "bulkOrderProcessing")}</option>
            <option value="delivered">{getLocalizedText("delivered", "bulkOrderProcessing")}</option>
          </select>
        </label>
        <label>
          {getLocalizedText("sortBy", "bulkOrderProcessing")}
          <select onChange={(e) => handleSortChange(e.target.value)}>
            <option value="date">{getLocalizedText("date", "common")}</option>
            <option value="total">{getLocalizedText("total", "bulkOrderProcessing")}</option>
            <option value="customerName">{getLocalizedText("customerName", "bulkOrderProcessing")}</option>
          </select>
        </label>
      </FiltersContainer>

      <OrdersTable>
        <thead>
          <tr>
            <th>{getLocalizedText("select", "bulkOrderProcessing")}</th>
            <th>{getLocalizedText("orderId", "common")}</th>
            <th>{getLocalizedText("status", "common")}</th>
            <th>{getLocalizedText("total", "bulkOrderProcessing")}</th>
            <th>{getLocalizedText("customerName", "bulkOrderProcessing")}</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedOrders.includes(order.id)}
                  onChange={() => handleSelectOrder(order.id)}
                />
              </td>
              <td>{order.id}</td>
              <td>{order.status}</td>
              <td>{order.total}</td>
              <td>{order.customerName}</td>
            </tr>
          ))}
        </tbody>
      </OrdersTable>

      <BulkActionButton
        onClick={() => handleBulkStatusUpdate("shipped")}
        disabled={selectedOrders.length === 0}
      >
        {getLocalizedText("markAsShipped", "bulkOrderProcessing")}
      </BulkActionButton>
    </BulkOrderContainer>
  );
};

export default BulkOrderProcessing;

