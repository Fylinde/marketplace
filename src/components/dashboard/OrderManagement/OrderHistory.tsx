// Track order historyimport React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/reduxHooks";
import { fetchOrderHistory } from "../../../redux/slices/orders/orderSlice";
import Box from "components/Box";
import Table from "components/table/Table";
import Button from "components/buttons/Button";
import Modal from "components/modal/Modal";
import Input from "components/input/Input";
import Pagination from "components/pagination/Pagination";
import { Order } from "types/order";
import { RootState } from "../../../redux/store";
import React, { useEffect, useState } from "react";
import type { AppDispatch } from "../../../redux/store";
import { useDispatch, useSelector } from "react-redux";


const OrderHistory: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const orders = useAppSelector((state: RootState) => state.orders.history);
  const isLoading = useAppSelector((state: RootState) => state.orders.loading);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"All" | "Pending" | "Processing" | "Delivered" | "Cancelled">("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const itemsPerPage = 10;

  useEffect(() => {
    const filters = filterStatus !== "All" ? { status: filterStatus } : {};
    dispatch(fetchOrderHistory({ page: currentPage, filters }));
  }, [dispatch, currentPage, filterStatus]);



  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order.id.includes(searchTerm) || (order.customerNote || "").toLowerCase().includes(searchTerm.toLowerCase());
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
      <h1>Order History</h1>

      {/* Search and Filters */}
      <Box display="flex" justifyContent="space-between" mb="20px">
        <Input
          label="Search Orders"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as any)}
        >
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="Processing">Processing</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </Box>

      {/* Order Table */}
      {isLoading ? (
        <p>Loading orders...</p>
      ) : (
        <>
          <Table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Total</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedOrders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{new Date(order.date).toLocaleDateString()}</td>
                  <td>${order.total.toFixed(2)}</td>
                  <td>{order.status}</td>
                  <td>
                    <Button onClick={() => handleSelectOrder(order)}>View Details</Button>
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
          title={`Order Details: ${selectedOrder.id}`}
          open={!!selectedOrder}
          onClose={closeOrderModal}
        >
          <Box>
            <h3>Customer Information</h3>
            <p>
              <strong>Shipping Address:</strong>{" "}
              {selectedOrder.shippingAddress && selectedOrder.shippingAddress.length > 0 ? (
                selectedOrder.shippingAddress.map((address, index) => (
                  <div key={index}>
                    <p>{`${address.addressLine1}, ${address.addressLine2 || ""}`}</p>
                    <p>{`${address.city}, ${address.state}, ${address.postalCode}`}</p>
                    <p>{address.country}</p>
                  </div>
                ))
              ) : (
                <span>No shipping address available.</span>
              )}
            </p>
            <p>
              <strong>Customer Note:</strong> {selectedOrder.customerNote || "No notes provided"}
            </p>

            <h3>Order Items</h3>
            <Table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {selectedOrder.items.map((item) => (
                  <tr key={item.productId}>
                    <td>{item.productName}</td>
                    <td>{item.quantity}</td>
                    <td>${item.price.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>

            <h3>Order Summary</h3>
            <p>
              <strong>Subtotal:</strong> ${selectedOrder.subtotal.toFixed(2)}
            </p>
            <p>
              <strong>Shipping Fee:</strong> ${selectedOrder.shippingFee.toFixed(2)}
            </p>
            <p>
              <strong>Discount:</strong> ${selectedOrder.discount.toFixed(2)}
            </p>
            <p>
              <strong>Total:</strong> ${selectedOrder.total.toFixed(2)}
            </p>
          </Box>
        </Modal>

      )}
    </Box>
  );
};

export default OrderHistory;
