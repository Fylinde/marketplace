import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Divider } from "antd";
import { RootState } from "../../redux/store";
import priceCalculation from "../../utils/priceCalculations";
import shippingCalculator from "../../utils/shippingCalculator";
import taxService from "../../services/taxService";
import {
  SummaryCard,
  SummaryTitle,
  ItemList,
  DetailSection,
  TotalsSection,
} from "./styles/OrderSummary.styles";

const OrderSummary: React.FC<{
  showTotals?: boolean;
  showDeliveryDetails?: boolean;
}> = ({ showTotals = true, showDeliveryDetails = true }) => {
  const { cartItems, discount, deliveryOption, currency } = useSelector(
    (state: RootState) => state.checkout
  );
  const { shippingAddress } = useSelector((state: RootState) => state.shipping);

  const [totalBuyerPrice, setTotalBuyerPrice] = useState<number>(0);
  const [totalSellerPrice, setTotalSellerPrice] = useState<number>(0);
  const [totalShippingCost, setTotalShippingCost] = useState<number>(0);
  const [totalTax, setTotalTax] = useState<number>(0);
  const [grandTotal, setGrandTotal] = useState<number>(0);

  useEffect(() => {
    calculateOrderSummary();
  }, [cartItems, deliveryOption, shippingAddress]);

  const calculateOrderSummary = async () => {
    try {
      const priceResult = priceCalculation.calculate({
        items: cartItems.map((item) => ({
          buyerPrice: item.buyerPrice,
          sellerPrice: item.sellerPrice,
          quantity: item.quantity,
          discount: item.discount || 0,
          taxRate: 0,
        })),
      });

      setTotalBuyerPrice(priceResult.totalBuyerPrice);
      setTotalSellerPrice(priceResult.totalSellerPrice);

      if (deliveryOption && shippingAddress) {
        const shippingData = await shippingCalculator.calculateShipping({
          methodId: deliveryOption.id,
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
      console.error("Error calculating order summary:", error);
    }
  };

  return (
    <SummaryCard>
      <SummaryTitle>Order Summary</SummaryTitle>
      <ItemList>
        {cartItems.map((item) => (
          <li key={item.id}>
            <span>
              {item.name} - Qty: {item.quantity}
            </span>
            <div>
              <p>{`Seller Price: ${item.sellerPrice} USD`}</p>
              <p>{`Buyer Price: ${item.buyerPrice} ${currency}`}</p>
            </div>
          </li>
        ))}
      </ItemList>
      <Divider />
      {showDeliveryDetails && deliveryOption && (
        <DetailSection>
          <h5>Delivery Details</h5>
          <p>{`Date: ${deliveryOption.date}`}</p>
          <p>{`Time: ${deliveryOption.time}`}</p>
          <p>{`Cost: ${deliveryOption.price} ${currency}`}</p>
        </DetailSection>
      )}
      {showTotals && (
        <TotalsSection>
          <p>
            <strong>Total Buyer Price:</strong> {totalBuyerPrice.toFixed(2)} {currency}
          </p>
          <p>
            <strong>Total Seller Price:</strong> {totalSellerPrice.toFixed(2)} USD
          </p>
          <p>
            <strong>Shipping Cost:</strong> {totalShippingCost.toFixed(2)} {currency}
          </p>
          <p>
            <strong>Tax:</strong> {totalTax.toFixed(2)} {currency}
          </p>
          <p>
            <strong>Discount:</strong> -{discount} {currency}
          </p>
          <p>
            <strong>Grand Total:</strong> {grandTotal.toFixed(2)} {currency}
          </p>
        </TotalsSection>
      )}
    </SummaryCard>
  );
};

export default OrderSummary;
