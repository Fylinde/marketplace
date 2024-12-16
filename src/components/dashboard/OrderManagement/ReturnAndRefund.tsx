import React, { useState, useEffect } from "react";
import {
  fetchOrderDetails,
  requestRefund,
  updateOrderStatus,
  selectOrderById,
} from "../../../redux/slices/orders/orderSlice";
import { refundPaymentThunk } from "../../../redux/slices/orders/paymentSlice";
import { getLocalizedText, formatCurrency } from "../../../utils/localizationUtils";
import { useAppDispatch, useAppSelector } from "../../../redux/reduxHooks";
import Loader from "../../../components/loader/Loader";
import ErrorNotification from "../../../components/errorNotification/ErrorNotification";
import SuccessNotification from "../../../components/successNotification/SuccessNotification";
import { RootState } from "../../../redux/store";

interface ReturnAndRefundProps {
  orderId: string;
}

const ReturnAndRefund: React.FC<ReturnAndRefundProps> = ({ orderId }) => {
  const dispatch = useAppDispatch();
  const order = useAppSelector((state: RootState) => selectOrderById(state, orderId));

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        if (!order) {
          setLoading(true);
          await dispatch(fetchOrderDetails(orderId)).unwrap();
        }
      } catch (err) {
        console.error("Error fetching order:", err);
        setError(getLocalizedText("errorFetchingOrder", "refundAutomation"));
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId, order, dispatch]);

  const handleRefundRequest = async () => {
    if (!order) {
      setError(getLocalizedText("orderNotFound", "refundAutomation"));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Step 1: Record the refund request
      const refundRequestResponse = await dispatch(
        requestRefund({ orderId, reason: "Customer requested refund" })
      ).unwrap();

      // Step 2: Trigger refund payment
      const paymentResponse = await dispatch(
        refundPaymentThunk({ paymentId: order.paymentId, currency: order.currency })
      ).unwrap();

      if (paymentResponse.success) {
        // Step 3: Update order status to "Refunded"
        await dispatch(updateOrderStatus({ orderId, status: "Refunded" })).unwrap();

        setSuccess(
          getLocalizedText("refundSuccessful", "refundAutomation", {
            message: refundRequestResponse.message,
          })
        );
      } else {
        setError(
          getLocalizedText("refundFailed", "refundAutomation", { reason: paymentResponse.message || "unknown" })
        );
      }

    } catch (err) {
      setError(getLocalizedText("refundError", "refundAutomation"));
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;
  if (error) return <ErrorNotification message={error} />;

  return (
    <div className="return-and-refund">
      <h2>{getLocalizedText("returnAndRefundTitle", "refundAutomation")}</h2>
      {success && <SuccessNotification message={success} />}
      {order ? (
        <div className="order-details">
          <p>
            <strong>{getLocalizedText("orderID", "refundAutomation")}: </strong>
            {order.id}
          </p>
          <p>
            <strong>{getLocalizedText("paymentType", "refundAutomation")}: </strong>
            {getLocalizedText(order.paymentType, "refundAutomation")}
          </p>
          <p>
            <strong>{getLocalizedText("buyerPrice", "refundAutomation")}: </strong>
            {formatCurrency(order.totalBuyerPrice || 0, order.buyerCurrency)}
          </p>
          <p>
            <strong>{getLocalizedText("sellerPrice", "refundAutomation")}: </strong>
            {formatCurrency(order.totalSellerPrice || 0, order.sellerCurrency)}
          </p>
          <p>
            <strong>{getLocalizedText("orderStatus", "refundAutomation")}: </strong>
            {getLocalizedText(order.status, "refundAutomation")}
          </p>
          {order.status === "Completed" ? (
            <button
              className="refund-button"
              onClick={handleRefundRequest}
              disabled={loading}
            >
              {getLocalizedText("requestRefund", "refundAutomation")}
            </button>
          ) : order.status === "Refunded" ? (
            <p>{getLocalizedText("refundProcessed", "refundAutomation")}</p>
          ) : null}
        </div>
      ) : (
        <p>{getLocalizedText("orderNotAvailable", "refundAutomation")}</p>
      )}
    </div>
  );
};

export default ReturnAndRefund;
