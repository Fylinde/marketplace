import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/reduxHooks";
import { fetchOrderHistory } from "../../../redux/slices/orders/orderSlice";
import Box from "../../../components/Box";
import Table from "../../../components/table/Table";
import Button from "../../../components/buttons/Button";
import Modal from "../../../components/modal/Modal";
import Input from "../../../components/input/Input";
import Pagination from "../../../components/pagination/Pagination";
import { Order } from "../../../types/order";
import type { AppDispatch, RootState } from "../../../redux/store";
import { formatCurrency, getLocalizedText } from "../../../utils/localizationUtils";

const OrderHistory: React.FC = () => {
  const dispatch = useAppDispatch();
  const orders = useAppSelector((state: RootState) => state.orders.history);
  const isLoading = useAppSelector((state: RootState) => state.orders.loading);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"All" | "Pending" | "Processing" | "Delivered" | "Cancelled">(
    "All"
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const itemsPerPage = 10;

  useEffect(() => {
    const filters = filterStatus !== "All" ? { status: filterStatus } : {};
    dispatch(fetchOrderHistory({ page: currentPage, filters }));
  }, [dispatch, currentPage, filterStatus]);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.includes(searchTerm) || (order.customerNote || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "All" || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const paginatedOrders = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleSelectOrder = (order: Order) => {
    setSelectedOrder(order);
  };

  const closeOrderModal = () => {
    setSelectedOrder(null);
  };

  return (
    <Box>
      <h1>{getLocalizedText("orderHistory", "orders")}</h1>

      {/* Search and Filters */}
      <Box display="flex" justifyContent="space-between" mb="20px">
        <Input
          label={getLocalizedText("searchOrders", "orders")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as any)}>
          <option value="All">{getLocalizedText("all", "common")}</option>
          <option value="Pending">{getLocalizedText("pending", "orders")}</option>
          <option value="Processing">{getLocalizedText("processing", "orders")}</option>
          <option value="Delivered">{getLocalizedText("delivered", "orders")}</option>
          <option value="Cancelled">{getLocalizedText("cancelled", "orders")}</option>
        </select>
      </Box>

      {/* Order Table */}
      {isLoading ? (
        <p>{getLocalizedText("loadingOrders", "orders")}</p>
      ) : (
        <>
          <Table>
            <thead>
              <tr>
                <th>{getLocalizedText("orderId", "orders")}</th>
                <th>{getLocalizedText("date", "orders")}</th>
                <th>{getLocalizedText("total", "orders")}</th>
                <th>{getLocalizedText("status", "orders")}</th>
                <th>{getLocalizedText("actions", "orders")}</th>
              </tr>
            </thead>
            <tbody>
              {paginatedOrders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{new Date(order.date).toLocaleDateString()}</td>
                  <td>
                    {formatCurrency(order.total, order.buyerCurrency || order.currency || "USD")}
                  </td>
                  <td>{getLocalizedText(order.status.toLowerCase(), "orders")}</td>
                  <td>
                    <Button onClick={() => handleSelectOrder(order)}>
                      {getLocalizedText("viewDetails", "orders")}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {/* Pagination */}
          <Pagination
            pageCount={Math.ceil(filteredOrders.length / itemsPerPage)}
            onChange={({ selected }) => setCurrentPage(selected + 1)}
            forcePage={currentPage - 1}
          />
        </>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <Modal
          title={`${getLocalizedText("orderDetails", "orders")}: ${selectedOrder.id}`}
          open={!!selectedOrder}
          onClose={closeOrderModal}
        >
          <Box>
            <h3>{getLocalizedText("customerInformation", "orders")}</h3>
            <p>
              <strong>{getLocalizedText("shippingAddress", "orders")}:</strong>{" "}
              {selectedOrder.shippingAddress && selectedOrder.shippingAddress.length > 0 ? (
                selectedOrder.shippingAddress.map((address, index) => (
                  <div key={index}>
                    <p>{`${address.addressLine1}, ${address.addressLine2 || ""}`}</p>
                    <p>{`${address.city}, ${address.state}, ${address.postalCode}`}</p>
                    <p>{address.country}</p>
                  </div>
                ))
              ) : (
                <span>{getLocalizedText("noShippingAddress", "orders")}</span>
              )}
            </p>
            <p>
              <strong>{getLocalizedText("customerNote", "orders")}:</strong>{" "}
              {selectedOrder.customerNote || getLocalizedText("noNotesProvided", "orders")}
            </p>

            <h3>{getLocalizedText("orderItems", "orders")}</h3>
            <Table>
              <thead>
                <tr>
                  <th>{getLocalizedText("product", "orders")}</th>
                  <th>{getLocalizedText("quantity", "orders")}</th>
                  <th>{getLocalizedText("price", "orders")}</th>
                </tr>
              </thead>
              <tbody>
                {selectedOrder.items.map((item) => (
                  <tr key={item.productId}>
                    <td>{item.productName}</td>
                    <td>{item.quantity}</td>
                    <td>
                      {formatCurrency(
                        item.buyerPrice || item.price || 0,
                        selectedOrder.buyerCurrency || selectedOrder.currency || "USD"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            <h3>{getLocalizedText("orderSummary", "orders")}</h3>
            <p>
              <strong>{getLocalizedText("subtotal", "orders")}:</strong>{" "}
              {formatCurrency(selectedOrder.subtotal, selectedOrder.buyerCurrency || "USD")}
            </p>
            <p>
              <strong>{getLocalizedText("shippingFee", "orders")}:</strong>{" "}
              {formatCurrency(selectedOrder.shippingFee, selectedOrder.buyerCurrency || "USD")}
            </p>
            <p>
              <strong>{getLocalizedText("discount", "orders")}:</strong>{" "}
              {formatCurrency(selectedOrder.discount, selectedOrder.buyerCurrency || "USD")}
            </p>
            <p>
              <strong>{getLocalizedText("total", "orders")}:</strong>{" "}
              {formatCurrency(selectedOrder.total, selectedOrder.buyerCurrency || "USD")}
            </p>
          </Box>
        </Modal>
      )}
    </Box>
  );
};

export default OrderHistory;
