import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Table, Button, Alert, Divider, Typography } from "antd";
import { RootState } from "../../redux/store";
import { removeItemFromCart, fetchRecommendations } from "../../redux/slices/orders/cartSlice";
import priceCalculation from "../../utils/priceCalculations";
import shippingCalculator from "../../utils/shippingCalculator";
import taxService from "../../services/taxService";
import {
  CartContainer,
  RecommendationsContainer,
  RecommendationCard,
  RecommendationImage,
  CartSummaryContainer,
  SummaryText,
  ProceedButton,
} from "./styles/CartReview.styles";
import type { AppDispatch } from "../../redux/store";
import { Space } from "antd";


const { Title, Text } = Typography;

const CartReview: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { cartList, recommendations, currency } = useSelector((state: RootState) => state.cart);
  const { shippingAddress, selectedMethod } = useSelector((state: RootState) => state.shipping);

  const [totalBuyerPrice, setTotalBuyerPrice] = useState<number>(0);
  const [totalSellerPrice, setTotalSellerPrice] = useState<number>(0);
  const [totalShippingCost, setTotalShippingCost] = useState<number>(0);
  const [totalTax, setTotalTax] = useState<number>(0);
  const [grandTotal, setGrandTotal] = useState<number>(0);

  useEffect(() => {
    dispatch(fetchRecommendations());
  }, [dispatch]);

  useEffect(() => {
    calculateCartSummary();
  }, [cartList, selectedMethod, shippingAddress]);

  const calculateCartSummary = async () => {
    try {
      const priceResult = priceCalculation.calculate({
        items: cartList.map((item) => ({
          buyerPrice: item.buyerPrice,
          sellerPrice: item.sellerPrice,
          quantity: item.quantity,
          discount: item.discount || 0,
          taxRate: 0,
        })),
      });

      setTotalBuyerPrice(priceResult.totalBuyerPrice);
      setTotalSellerPrice(priceResult.totalSellerPrice);

      if (selectedMethod && shippingAddress) {
        const shippingData = await shippingCalculator.calculateShipping({
          methodId: selectedMethod,
          address: shippingAddress,
          cartTotal: priceResult.totalBuyerPrice,
        });
        setTotalShippingCost(shippingData.shippingCost);
      }

      const taxData = await taxService.calculateTax({
        price: priceResult.totalBuyerPrice + totalShippingCost,
        country: shippingAddress?.country || "",
        region: shippingAddress?.state || "",
      });

      setTotalTax(taxData.taxAmount);

      const grandTotalPrice =
        priceResult.totalBuyerPrice + totalShippingCost + taxData.taxAmount - priceResult.totalDiscount;

      setGrandTotal(grandTotalPrice);
    } catch (error) {
      console.error("Error calculating cart summary:", error);
    }
  };

  const columns = [
    {
      title: "Product",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: any) => (
        <Space>
          <img src={record.image} alt={text} style={{ width: 50, height: 50 }} />
          <Text>{text}</Text>
        </Space>
      ),
    },
    {
      title: "Seller Price",
      dataIndex: "sellerPrice",
      key: "sellerPrice",
      render: (price: number) => <Text>{`${price} USD`}</Text>,
    },
    {
      title: "Buyer Price",
      dataIndex: "buyerPrice",
      key: "buyerPrice",
      render: (price: number) => <Text>{`${price} ${currency}`}</Text>,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => (
        <Button type="link" danger onClick={() => dispatch(removeItemFromCart(record.id))}>
          Remove
        </Button>
      ),
    },
  ];

  return (
    <CartContainer>
      <Title level={2}>Your Cart</Title>
      <Table columns={columns} dataSource={cartList} rowKey="id" pagination={false} />

      <Divider />

      <CartSummaryContainer>
        <Title level={3}>Cart Summary</Title>
        <SummaryText>Total Buyer Price: {totalBuyerPrice.toFixed(2)} {currency}</SummaryText>
        <SummaryText>Total Seller Price: {totalSellerPrice.toFixed(2)} USD</SummaryText>
        <SummaryText>Shipping Cost: {totalShippingCost.toFixed(2)} {currency}</SummaryText>
        <SummaryText>Tax: {totalTax.toFixed(2)} {currency}</SummaryText>
        <SummaryText strong>Total (Grand Total): {grandTotal.toFixed(2)} {currency}</SummaryText>
      </CartSummaryContainer>

      <Divider />

      <div>
        <Title level={3}>Recommendations for You</Title>
        {recommendations.length ? (
          <RecommendationsContainer>
            {recommendations.map((item) => (
              <RecommendationCard key={item.id}>
                <RecommendationImage src={item.image} alt={item.name} />
                <Text>{item.name}</Text>
                <Text type="secondary">{`Seller Price: ${item.sellerPrice} USD`}</Text>
                <Text>{`Buyer Price: ${item.buyerPrice} ${currency}`}</Text>
                <Button type="primary" style={{ marginTop: "10px" }}>
                  Add to Cart
                </Button>
              </RecommendationCard>
            ))}
          </RecommendationsContainer>
        ) : (
          <Alert message="No recommendations available at this time." type="info" showIcon />
        )}
      </div>

      <ProceedButton>
        <Button type="primary" size="large">
          Proceed to Checkout
        </Button>
      </ProceedButton>
    </CartContainer>
  );
};

export default CartReview;
