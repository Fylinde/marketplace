import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { List, Divider, Spin, Alert } from "antd";
import { fetchOrderDetails, selectOrderById } from "../../redux/slices/orders/orderSlice";
import priceCalculation from "../../utils/priceCalculations";
import shippingCalculator from "../../utils/shippingCalculator";
import taxService from "../../services/taxService";
import {
  OrderCard,
  OrderHeader,
  OrderDetails,
  SummaryList,
  PriceDetails,
} from "./styles/OrderConfirmation.styles";
import type { AppDispatch, RootState } from "../../redux/store";
import { Order } from "@/types/order";

const OrderConfirmation: React.FC<{ orderId: string }> = ({ orderId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const order = useSelector((state: RootState) => selectOrderById(state, orderId));
  const loading = useSelector((state: RootState) => state.orders.loading);
  const error = useSelector((state: RootState) => state.orders.error);

  const [priceResult, setPriceResult] = useState<ReturnType<typeof priceCalculation.calculate> | null>(null);
  const [totalShippingCost, setTotalShippingCost] = useState<number>(0);
  const [totalTax, setTotalTax] = useState<number>(0);
  const [grandTotal, setGrandTotal] = useState<number>(0);

  useEffect(() => {
    if (!order) {
      dispatch(fetchOrderDetails(orderId));
    }
  }, [dispatch, order, orderId]);

  useEffect(() => {
    if (order) {
      calculateOrderSummary();
    }
  }, [order]);

  const calculateOrderSummary = async () => {
    if (!order) return;

    try {
      // Extract `ExchangeRate` object
      const exchangeRate = Array.isArray(order.exchangeRates) && order.exchangeRates.length > 0
        ? order.exchangeRates[0]
        : null;

      if (!exchangeRate) {
        console.error("No valid exchange rate found");
        return;
      }

      const calculatedPrices = priceCalculation.calculate({
        items: order.items.map((item) => ({
          buyerPrice: item.buyerPrice ?? item.price ?? 0, // Fallback to 0 if undefined
          sellerPrice: item.sellerPrice ?? item.price ?? 0, // Fallback to 0 if undefined
          quantity: item.quantity,
          discount: item.discount || 0,
          taxRate: item.taxRate || 0,
        })),
        shippingCost: totalShippingCost || 0,
        exchangeRate: exchangeRate, // Ensure a valid ExchangeRate is passed
        buyerCurrency: order.buyerCurrency, // Pass buyerCurrency
        sellerCurrency: order.sellerCurrency, // Pass sellerCurrency
      });


      setPriceResult(calculatedPrices);

      const shippingAddress = Array.isArray(order.shippingAddress)
        ? order.shippingAddress[0]
        : order.shippingAddress;

      if (order.deliveryOption && shippingAddress) {
        const shippingData = await shippingCalculator.calculateShipping({
          methodId: order.deliveryOption.id,
          address: shippingAddress,
          cartTotal: calculatedPrices.totalBuyerPrice,
        });
        setTotalShippingCost(shippingData.shippingCost);
      }

      const taxData = await taxService.calculateTax({
        price: calculatedPrices.totalBuyerPrice + totalShippingCost,
        country: shippingAddress?.country || "",
        region: shippingAddress?.state || "",
      });
      setTotalTax(taxData.taxAmount);

      const grandTotalPrice =
        calculatedPrices.totalBuyerPrice +
        totalShippingCost +
        taxData.taxAmount -
        calculatedPrices.totalDiscount;
      setGrandTotal(grandTotalPrice);
    } catch (error) {
      console.error("Error calculating order summary:", error);
    }
  };


  if (loading) return <Spin size="large" />;
  if (error) return <Alert message={error} type="error" showIcon />;
  if (!order) return <Alert message="Order not found" type="warning" showIcon />;

  return (
    <OrderCard>
      <OrderHeader>
        <h2>Order Confirmation</h2>
      </OrderHeader>
      <OrderDetails>
        <strong>Order Number:</strong> <span>{order.id}</span>
        <strong>Estimated Delivery Date:</strong>{" "}
        <span>{order.estimatedDeliveryDate || "TBD"}</span>
      </OrderDetails>
      <Divider />
      <SummaryList>
        <List
          itemLayout="horizontal"
          dataSource={order.items}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                title={item.productName || item.name}
                description={
                  <>
                    <span>{`Quantity: ${item.quantity}`}</span>
                    <span>{`Seller Price: ${item.sellerPrice ?? 0} ${order.sellerCurrency || order.currency}`}</span>
                    <span>{`Buyer Price: ${item.buyerPrice ?? 0} ${order.buyerCurrency || order.currency}`}</span>
                  </>
                }
              />
            </List.Item>
          )}
        />

      </SummaryList>
      <Divider />
      {priceResult && (
        <PriceDetails>
          <span>
            <strong>Total Seller Price:</strong> {priceResult.totalSellerPrice.toFixed(2)} USD
          </span>
          <span>
            <strong>Total Buyer Price:</strong> {priceResult.totalBuyerPrice.toFixed(2)} {order.currency}
          </span>
          <span>
            <strong>Shipping Cost:</strong> {totalShippingCost.toFixed(2)} {order.currency}
          </span>
          <span>
            <strong>Tax:</strong> {totalTax.toFixed(2)} {order.currency}
          </span>
          <span>
            <strong>Grand Total:</strong> {grandTotal.toFixed(2)} {order.currency}
          </span>
        </PriceDetails>
      )}
    </OrderCard>
  );
};

export default OrderConfirmation;
