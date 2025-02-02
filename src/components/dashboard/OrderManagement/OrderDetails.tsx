import React, { useEffect, useState } from "react";
import Box from "../../../components/Box";
import Button from "../../../components/buttons/Button";
import Modal from "../../../components/modal/Modal";
import Input from "../../../components/input/Input";
import Table from "../../../components/table/Table";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../redux/reduxHooks";
import { fetchOrderById, updateOrderStatus } from "../../../redux/slices/orders/orderSlice";
import { RootState } from "../../../redux/store";
import { sendMessage } from "../../../redux/slices/communication/chatbotSlice ";
import { Order } from "../../../types/order";
import { formatCurrency, getLocalizedText } from "../../..//utils/localizationUtils";

const OrderDetails: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const dispatch = useAppDispatch();

  // Retrieve the selected order from the Redux store
  const order = useAppSelector((state: RootState) => state.orders.selectedOrder as Order);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [messageModalOpen, setMessageModalOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [trackingModalOpen, setTrackingModalOpen] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState("");

  useEffect(() => {
    if (orderId) {
      setIsLoading(true);
      dispatch(fetchOrderById(orderId))
        .unwrap()
        .catch(() => setError("Failed to fetch order details."))
        .finally(() => setIsLoading(false));
    }
  }, [dispatch, orderId]);

  const handleUpdateStatus = (newStatus: "Pending" | "Processing" | "Delivered" | "Cancelled") => {
    if (!orderId) return;
    setIsLoading(true);

    dispatch(updateOrderStatus({ orderId, status: newStatus }))
      .unwrap()
      .catch(() => setError("Failed to update order status."))
      .finally(() => setIsLoading(false));
  };

  const handleSendMessage = () => {
    if (!orderId || !message.trim()) return;

    setIsLoading(true);
    dispatch(sendMessage({ message, context: { orderId } }))
      .unwrap()
      .then(() => alert("Message sent successfully!"))
      .catch(() => setError("Failed to send message to customer."))
      .finally(() => {
        setIsLoading(false);
        setMessageModalOpen(false);
      });
  };

  const handleUpdateTracking = () => {
    if (!orderId || !trackingNumber.trim()) return;
    setIsLoading(true);
    alert("Tracking number updated successfully!");
    setIsLoading(false);
    setTrackingModalOpen(false);
  };

  if (isLoading) return <p>{getLocalizedText("loading", "common")}</p>;
  if (error) return <p>{error}</p>;

  return (
    <Box>
      <h1>{getLocalizedText("orderDetails", "orders")}</h1>
      {order ? (
        <>
          <Box>
            <h3>{getLocalizedText("customerInformation", "orders")}</h3>
            <p>
              <strong>{getLocalizedText("note", "orders")}:</strong>{" "}
              {order.customerNote || getLocalizedText("noCustomerNote", "orders")}
            </p>
            <p>
              <strong>{getLocalizedText("address", "orders")}:</strong>{" "}
              {order.shippingAddress && order.shippingAddress.length > 0 ? (
                order.shippingAddress.map((address, index) => (
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
          </Box>

          <Box>
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
                {order.items.map((item) => (
                  <tr key={item.productId}>
                    <td>{item.productName}</td>
                    <td>{item.quantity}</td>
                    <td>
                      {formatCurrency(
                        item.buyerPrice || item.price || 0,
                        order.buyerCurrency || order.currency || "USD"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Box>

          <Box>
            <h3>{getLocalizedText("orderSummary", "orders")}</h3>
            <p>
              <strong>{getLocalizedText("subtotal", "orders")}:</strong>{" "}
              {formatCurrency(order.subtotal, order.buyerCurrency || order.currency || "USD")}
            </p>
            <p>
              <strong>{getLocalizedText("shippingFee", "orders")}:</strong>{" "}
              {formatCurrency(order.shippingFee, order.buyerCurrency || order.currency || "USD")}
            </p>
            <p>
              <strong>{getLocalizedText("discount", "orders")}:</strong>{" "}
              {formatCurrency(order.discount, order.buyerCurrency || order.currency || "USD")}
            </p>
            <p>
              <strong>{getLocalizedText("total", "orders")}:</strong>{" "}
              {formatCurrency(order.total, order.buyerCurrency || order.currency || "USD")}
            </p>
            <p>
              <strong>{getLocalizedText("status", "orders")}:</strong> {order.status}
            </p>
          </Box>

          <Box>
            <Button onClick={() => setMessageModalOpen(true)}>
              {getLocalizedText("messageCustomer", "orders")}
            </Button>
            <Button onClick={() => setTrackingModalOpen(true)}>
              {getLocalizedText("updateTracking", "orders")}
            </Button>
            <select
              value={order.status}
              onChange={(e) =>
                handleUpdateStatus(
                  e.target.value as "Pending" | "Processing" | "Delivered" | "Cancelled"
                )
              }
            >
              <option value="Pending">{getLocalizedText("pending", "orders")}</option>
              <option value="Processing">{getLocalizedText("processing", "orders")}</option>
              <option value="Delivered">{getLocalizedText("delivered", "orders")}</option>
              <option value="Cancelled">{getLocalizedText("cancelled", "orders")}</option>
            </select>
          </Box>
        </>
      ) : (
        <p>{getLocalizedText("noOrderDetails", "orders")}</p>
      )}

      {/* Message Modal */}
      {messageModalOpen && (
        <Modal
          title={getLocalizedText("sendMessage", "orders")}
          open={messageModalOpen}
          onClose={() => setMessageModalOpen(false)}
        >
          <Box>
            <Input
              label={getLocalizedText("message", "orders")}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <Button onClick={handleSendMessage}>{getLocalizedText("send", "orders")}</Button>
          </Box>
        </Modal>
      )}

      {/* Tracking Modal */}
      {trackingModalOpen && (
        <Modal
          title={getLocalizedText("updateTracking", "orders")}
          open={trackingModalOpen}
          onClose={() => setTrackingModalOpen(false)}
        >
          <Box>
            <Input
              label={getLocalizedText("trackingNumber", "orders")}
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
            />
            <Button onClick={handleUpdateTracking}>
              {getLocalizedText("update", "orders")}
            </Button>
          </Box>
        </Modal>
      )}
    </Box>
  );
};

export default OrderDetails;
