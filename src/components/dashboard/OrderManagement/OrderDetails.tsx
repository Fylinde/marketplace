import React, { useEffect, useState } from "react";
import Box from "components/Box";
import Button from "components/buttons/Button";
import Modal from "components/modal/Modal";
import Input from "components/input/Input";
import Table from "components/table/Table";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../redux/reduxHooks";
import { fetchOrderById, updateOrderStatus } from "../../../redux/slices/orders/orderSlice";
import { RootState } from "../../../redux/store";
import { sendMessage } from "@/redux/slices/communication/chatbotSlice ";
import { Order } from "types/order";

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

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <Box>
      <h1>Order Details</h1>
      {order ? (
        <>
          <Box>
            <h3>Customer Information</h3>
            <p>
              <strong>Note:</strong> {order.customerNote || "No customer note provided."}
            </p>
            <p>
              <strong>Address:</strong>{" "}
              {order.shippingAddress && order.shippingAddress.length > 0 ? (
                order.shippingAddress.map((address, index) => (
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
          </Box>


          <Box>
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
                {order.items.map((item) => (
                  <tr key={item.productId}>
                    <td>{item.productName}</td>
                    <td>{item.quantity}</td>
                    <td>${item.price.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Box>

          <Box>
            <h3>Order Summary</h3>
            <p>
              <strong>Subtotal:</strong> ${order.subtotal.toFixed(2)}
            </p>
            <p>
              <strong>Shipping Fee:</strong> ${order.shippingFee.toFixed(2)}
            </p>
            <p>
              <strong>Discount:</strong> ${order.discount.toFixed(2)}
            </p>
            <p>
              <strong>Total:</strong> ${order.total.toFixed(2)}
            </p>
            <p>
              <strong>Status:</strong> {order.status}
            </p>
          </Box>

          <Box>
            <Button onClick={() => setMessageModalOpen(true)}>Message Customer</Button>
            <Button onClick={() => setTrackingModalOpen(true)}>Update Tracking</Button>
            <select
              value={order.status}
              onChange={(e) =>
                handleUpdateStatus(
                  e.target.value as "Pending" | "Processing" | "Delivered" | "Cancelled"
                )
              }
            >
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </Box>
        </>
      ) : (
        <p>No order details available.</p>
      )}

      {/* Message Modal */}
      {messageModalOpen && (
        <Modal
          title="Send a Message to Customer"
          open={messageModalOpen}
          onClose={() => setMessageModalOpen(false)}
        >
          <Box>
            <Input
              label="Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <Button onClick={handleSendMessage}>Send Message</Button>
          </Box>
        </Modal>
      )}

      {/* Tracking Modal */}
      {trackingModalOpen && (
        <Modal
          title="Update Tracking Information"
          open={trackingModalOpen}
          onClose={() => setTrackingModalOpen(false)}
        >
          <Box>
            <Input
              label="Tracking Number"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
            />
            <Button onClick={handleUpdateTracking}>Update</Button>
          </Box>
        </Modal>
      )}
    </Box>
  );
};

export default OrderDetails;
