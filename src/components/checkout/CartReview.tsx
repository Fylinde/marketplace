import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Table, Button, Alert, Divider, Typography } from "antd";
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
import type { AppDispatch, RootState } from "../../redux/store";
import { Space } from "antd";
import { getLocalizedText, formatCurrency } from "../../utils/localizationUtils";
import { CartItem } from "../../types/cartItem"; // Update as needed
import { ExchangeRate } from "../../types/ExchangeRate";

const { Title, Text } = Typography;

const CartReview: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    cartList,
    recommendations,
    buyerCurrency: buyerCurrencyState,
    sellerCurrency: sellerCurrencyState,
    exchangeRate: exchangeRateArray,
  } = useSelector((state: RootState) => state.cart);
  const { shippingAddress, selectedMethod } = useSelector((state: RootState) => state.shipping);

  // Fallback to default currencies
  const buyerCurrency = buyerCurrencyState || "USD";
  const sellerCurrency = sellerCurrencyState || "USD";

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
      const exchangeRate = Array.isArray(exchangeRateArray) && exchangeRateArray.length > 0
        ? exchangeRateArray[0]
        : null;

      if (!exchangeRate) {
        console.error("No valid exchange rate found");
        return;
      }

      const priceResult = priceCalculation.calculate({
        items: cartList.map((item: CartItem) => ({
          sellerPrice: item.sellerPrice,
          quantity: item.quantity,
          discount: item.discount || 0,
          taxRate: 0,
          lockedExchangeRate: item.lockedExchangeRate ?? undefined,
        })),
        shippingCost: 0,
        exchangeRate: exchangeRate,
        buyerCurrency: buyerCurrency,
        sellerCurrency: sellerCurrency,
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
        priceResult.totalBuyerPrice +
        totalShippingCost +
        taxData.taxAmount -
        priceResult.totalDiscount;

      setGrandTotal(grandTotalPrice);
    } catch (error) {
      console.error("Error calculating cart summary:", error);
    }
  };

  const columns = [
    {
      title: getLocalizedText("product", "shipping"),
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
      title: getLocalizedText("sellerPrice", "shipping"),
      dataIndex: "sellerPrice",
      key: "sellerPrice",
      render: (price: number) => <Text>{formatCurrency(price, sellerCurrency)}</Text>,
    },
    {
      title: getLocalizedText("buyerPrice", "shipping"),
      dataIndex: "buyerPrice",
      key: "buyerPrice",
      render: (price: number) => <Text>{formatCurrency(price, buyerCurrency)}</Text>,
    },
    {
      title: getLocalizedText("actions", "shipping"),
      key: "actions",
      render: (_: any, record: any) => (
        <Button type="link" danger onClick={() => dispatch(removeItemFromCart(record.id))}>
          {getLocalizedText("remove", "shipping")}
        </Button>
      ),
    },
  ];

  return (
    <CartContainer>
      <Title level={2}>{getLocalizedText("yourCart", "shipping")}</Title>
      <Table columns={columns} dataSource={cartList} rowKey="id" pagination={false} />

      <Divider />

      <CartSummaryContainer>
        <Title level={3}>{getLocalizedText("cartSummary", "shipping")}</Title>
        <SummaryText>
          {getLocalizedText("totalBuyerPrice", "shipping")}:{" "}
          {formatCurrency(totalBuyerPrice, buyerCurrency)}
        </SummaryText>
        <SummaryText>
          {getLocalizedText("totalSellerPrice", "shipping")}:{" "}
          {formatCurrency(totalSellerPrice, sellerCurrency)}
        </SummaryText>
        <SummaryText>
          {getLocalizedText("shippingCost", "shipping")}:{" "}
          {formatCurrency(totalShippingCost, buyerCurrency)} ({sellerCurrency} equivalent)
        </SummaryText>
        <SummaryText>
          {getLocalizedText("tax", "shipping")}:{" "}
          {formatCurrency(totalTax, buyerCurrency)} ({sellerCurrency} equivalent)
        </SummaryText>
        <SummaryText strong>
          {getLocalizedText("grandTotal", "shipping")}:{" "}
          {formatCurrency(grandTotal, buyerCurrency)} ({sellerCurrency} equivalent)
        </SummaryText>
      </CartSummaryContainer>

      <Divider />

      <div>
        <Title level={3}>{getLocalizedText("recommendationsForYou", "shipping")}</Title>
        {recommendations.length ? (
          <RecommendationsContainer>
            {recommendations.map((item) => (
              <RecommendationCard key={item.id}>
                <RecommendationImage src={item.image} alt={item.name} />
                <Text>{item.name}</Text>
                <Text type="secondary">{`${getLocalizedText(
                  "sellerPrice",
                  "shipping"
                )}: ${formatCurrency(item.sellerPrice, sellerCurrency)}`}</Text>
                <Text>{`${getLocalizedText(
                  "buyerPrice",
                  "shipping"
                )}: ${formatCurrency(item.buyerPrice, buyerCurrency)}`}</Text>
                <Button type="primary" style={{ marginTop: "10px" }}>
                  {getLocalizedText("addToCart", "shipping")}
                </Button>
              </RecommendationCard>
            ))}
          </RecommendationsContainer>
        ) : (
          <Alert
            message={getLocalizedText("noRecommendations", "shipping")}
            type="info"
            showIcon
          />
        )}
      </div>

      <ProceedButton>
        <Button type="primary" size="large">
          {getLocalizedText("proceedToCheckout", "shipping")}
        </Button>
      </ProceedButton>
    </CartContainer>
  );
};

export default CartReview;
