import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/reduxHooks";
import {
  fetchOrderById,
  requestRefund,
} from "../../redux/slices/orders/orderSlice";
import { RootState } from "../../redux/store";
import Box from "../../components/Box";
import Card from "../../components/Card";
import FlexBox from "../../components/FlexBox";
import Grid from "../../components/grid/Grid";
import Button from "../../components/buttons/Button";
import Table from "../../components/table/Table";
import Typography, { H5, H6, Paragraph } from "../../components/Typography";
import Modal from "../../components/modal/Modal";
import Divider from "../../components/Divider";

const UserOrderDetail: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const dispatch = useAppDispatch();
  const order = useAppSelector((state: RootState) => state.orders.selectedOrder);
  const [isLoading, setIsLoading] = useState(false);
  const [refundReason, setRefundReason] = useState("");
  const [refundModalOpen, setRefundModalOpen] = useState(false);

  useEffect(() => {
    if (orderId) {
      setIsLoading(true);
      dispatch(fetchOrderById(orderId))
        .unwrap()
        .catch(() => console.error("Failed to fetch order details"))
        .finally(() => setIsLoading(false));
    }
  }, [dispatch, orderId]);

  const handleRequestRefund = () => {
    if (!refundReason.trim()) return;
    dispatch(requestRefund({ orderId: orderId!, reason: refundReason }))
      .unwrap()
      .then(() => alert("Refund requested successfully!"))
      .catch(() => alert("Failed to request refund."));
    setRefundModalOpen(false);
  };

  if (isLoading || !order) return <p>Loading...</p>;

  return (
    <Box>
      <Card p="20px" mb="30px">
        <H5>Order Summary</H5>
        <Divider mb="1rem" />
        <Grid container spacing={6}>
          <Grid item xs={6}>
            <Paragraph>
              <strong>Order ID:</strong> {order.id}
            </Paragraph>
            <Paragraph>
              <strong>Status:</strong> {order.status}
            </Paragraph>
            <Paragraph>
              <strong>Placed On:</strong>{" "}
              {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "N/A"}
            </Paragraph>
          </Grid>
          <Grid item xs={6}>
            <Paragraph>
              <strong>Buyer Total:</strong> {order.buyerCurrency} {order.totalBuyerPrice.toFixed(2)}
            </Paragraph>
            <Paragraph>
              <strong>Seller Total:</strong> {order.sellerCurrency} {order.totalSellerPrice.toFixed(2)}
            </Paragraph>
          </Grid>
        </Grid>
      </Card>

      <Card p="20px" mb="30px">
        <H5>Shipping Details</H5>
        <Divider mb="1rem" />
        {order.shippingAddress && order.shippingAddress.length > 0 ? (
          order.shippingAddress.map((address, index) => (
            <Paragraph key={index}>
              {address.addressLine1}, {address.city}, {address.state}, {address.postalCode}, {address.country}
            </Paragraph>
          ))
        ) : (
          <Paragraph>No shipping address available.</Paragraph>
        )}
      </Card>

      <Card p="20px" mb="30px">
        <H5>Order Items</H5>
        <Divider mb="1rem" />
        <Table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Quantity</th>
              <th>Buyer Price</th>
              <th>Seller Price</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.productId}>
                <td>{item.productName}</td>
                <td>{item.quantity}</td>
                <td>
                  {order.buyerCurrency} {((item.buyerPrice || 0) * item.quantity).toFixed(2)}
                </td>
                <td>
                  {order.sellerCurrency} {((item.sellerPrice || 0) * item.quantity).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>

      <FlexBox justifyContent="space-between" mt="1rem">
        <Button variant="outlined" onClick={() => setRefundModalOpen(true)}>
          Request Refund
        </Button>
        <Button variant="contained" color="primary">
          Reorder
        </Button>
      </FlexBox>

      <Modal open={refundModalOpen} onClose={() => setRefundModalOpen(false)} title="Request Refund">
        <Box p="1rem">
          <Typography>Why are you requesting a refund?</Typography>
          <textarea
            value={refundReason}
            onChange={(e) => setRefundReason(e.target.value)}
            style={{ width: "100%", height: "100px", marginTop: "1rem" }}
          />
          <Button onClick={handleRequestRefund} color="primary" mt="1rem">
            Submit Request
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default UserOrderDetail;
