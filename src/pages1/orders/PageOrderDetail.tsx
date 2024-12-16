import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import orderService from "@/services/orderService";
import Box from "components/Box";
import Card from "components/Card";
import Typography, { H5, H6, Paragraph } from "components/Typography";

const PageOrderDetail: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (orderId) {
      setIsLoading(true);
      orderService
        .fetchOrderDetails(orderId)
        .then((data) => setOrder(data))
        .catch(() => console.error("Failed to fetch order details"))
        .finally(() => setIsLoading(false));
    }
  }, [orderId]);

  if (isLoading || !order) return <p>Loading...</p>;

  return (
    <Box>
      <Card p="20px" mb="30px">
        <H5>Order Overview</H5>
        <Paragraph>
          <strong>Order ID:</strong> {order.id}
        </Paragraph>
        <Paragraph>
          <strong>Status:</strong> {order.status}
        </Paragraph>
        <Paragraph>
          <strong>Buyer Total:</strong> {order.buyerCurrency} {order.totalBuyerPrice.toFixed(2)}
        </Paragraph>
        <Paragraph>
          <strong>Seller Total:</strong> {order.sellerCurrency} {order.totalSellerPrice.toFixed(2)}
        </Paragraph>
      </Card>
    </Box>
  );
};

export default PageOrderDetail;
