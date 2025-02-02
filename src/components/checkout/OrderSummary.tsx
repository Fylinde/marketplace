import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Divider } from "antd";
import { RootState } from "../../redux/store";
import priceCalculation from "../../utils/priceCalculations";
import shippingCalculator from "../../utils/shippingCalculator";
import taxService from "../../services/taxService";
import { getLocalizedText, formatCurrency } from "../../utils/localizationUtils";
import {
  SummaryCard,
  SummaryTitle,
  ItemList,
  DetailSection,
  TotalsSection,
} from "./styles/OrderSummary.styles";
import { CartItem } from "../../types/cartItem";
import { ExchangeRate } from "../../types/ExchangeRate";

const OrderSummary: React.FC<{
  showTotals?: boolean;
  showDeliveryDetails?: boolean;
}> = ({ showTotals = true, showDeliveryDetails = true }) => {
  const {
    cartItems,
    discount,
    deliveryOption,
    buyerCurrency,
    sellerCurrency,
  } = useSelector((state: RootState) => state.checkout);
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
      const exchangeRate: ExchangeRate | null =
        cartItems[0]?.exchangeRate || null;

      if (!exchangeRate) {
        console.error("No valid exchange rate found");
        return;
      }

      const priceResult = priceCalculation.calculate({
        items: cartItems.map((item: CartItem) => ({
          buyerPrice: item.buyerPrice || 0,
          sellerPrice: item.sellerPrice || 0,
          quantity: item.quantity || 1,
          discount: item.discount || 0,
          taxRate: 0,
          lockedExchangeRate: item.lockedExchangeRate ?? undefined,
        })),
        shippingCost: totalShippingCost || 0,
        exchangeRate: exchangeRate,
        buyerCurrency: buyerCurrency || "USD",
        sellerCurrency: sellerCurrency || "USD",
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
        priceResult.totalBuyerPrice +
        totalShippingCost +
        taxData.taxAmount -
        priceResult.totalDiscount;
      setGrandTotal(grandTotalPrice);
    } catch (error) {
      console.error("Error calculating order summary:", error);
    }
  };

  return (
    <SummaryCard>
      <SummaryTitle>{getLocalizedText("orderSummary", "checkout")}</SummaryTitle>
      <ItemList>
        {cartItems.map((item) => (
          <li key={item.id}>
            <span>
              {item.name} - {getLocalizedText("quantity", "checkout")}:{" "}
              {item.quantity}
            </span>
            <div>
              <p>
                {`${getLocalizedText("sellerPrice", "checkout")}: ${formatCurrency(
                  item.sellerPrice,
                  sellerCurrency || "USD"
                )}`}
              </p>
              <p>
                {`${getLocalizedText("buyerPrice", "checkout")}: ${formatCurrency(
                  item.buyerPrice,
                  buyerCurrency || "USD"
                )}`}
              </p>
            </div>
          </li>
        ))}
      </ItemList>
      <Divider />
      {showDeliveryDetails && deliveryOption && (
        <DetailSection>
          <h5>{getLocalizedText("deliveryDetails", "checkout")}</h5>
          <p>{`${getLocalizedText("date", "checkout")}: ${deliveryOption.date}`}</p>
          <p>{`${getLocalizedText("time", "checkout")}: ${deliveryOption.time}`}</p>
          <p>
            {`${getLocalizedText("cost", "checkout")}: ${formatCurrency(
              deliveryOption.price,
              buyerCurrency || "USD"
            )}`}
          </p>
        </DetailSection>
      )}
      {showTotals && (
        <TotalsSection>
          <p>
            <strong>
              {getLocalizedText("totalBuyerPrice", "checkout")}:
            </strong>{" "}
            {formatCurrency(totalBuyerPrice, buyerCurrency || "USD")}
          </p>
          <p>
            <strong>
              {getLocalizedText("totalSellerPrice", "checkout")}:
            </strong>{" "}
            {formatCurrency(totalSellerPrice, sellerCurrency || "USD")}
          </p>
          <p>
            <strong>{getLocalizedText("shippingCost", "checkout")}:</strong>{" "}
            {formatCurrency(totalShippingCost, buyerCurrency || "USD")}
          </p>
          <p>
            <strong>{getLocalizedText("tax", "checkout")}:</strong>{" "}
            {formatCurrency(totalTax, buyerCurrency || "USD")}
          </p>
          <p>
            <strong>{getLocalizedText("discount", "checkout")}:</strong> -{" "}
            {formatCurrency(discount, buyerCurrency || "USD")}
          </p>
          <p>
            <strong>{getLocalizedText("grandTotal", "checkout")}:</strong>{" "}
            {formatCurrency(grandTotal, buyerCurrency || "USD")}
          </p>
        </TotalsSection>
      )}
    </SummaryCard>
  );
};

export default OrderSummary;
