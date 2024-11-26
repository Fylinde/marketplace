import React, { useState, useEffect } from 'react';
import { fetchOrderDetails, requestRefund } from 'redux/slices/orderSlice';
import { updateOrderStatus } from 'redux/slices/orderSlice';
import selectOrder from "redux/slices/orderSlice";
import { getLocalizedText, formatCurrency } from '@/components/utils/localizationUtils';
import { useAppDispatch, useAppSelector } from '@/redux/slices/reduxHooks';
import Loader from '@/components/loader/Loader';
import ErrorNotification from '@/components/errorNotification/ErrorNotification';
import SuccessNotification from '@/components/successNotification/SuccessNotification';
import  refundPayment  from '@/redux/slices/paymentSlice';
import { RootState } from '@/redux/store';


interface ReturnAndRefundProps {
  orderId: string;
}

const ReturnAndRefund: React.FC<ReturnAndRefundProps> = ({ orderId }) => {
  const dispatch = useAppDispatch();
  const order = useAppSelector((state) => selectOrderById(state, orderId));

  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        if (!order) {
          setLoading(true);
          const data = await dispatch(fetchOrderDetails(orderId)).unwrap();
          dispatch(updateOrderStatus(data));
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
      const refundResponse = await dispatch(
        refundPayment({
          paymentId: order.paymentId,
          currency: order.currency,
        })
      ).unwrap();

      if (refundResponse.success) {
        dispatch(updateOrderStatus({ orderId, status: "Refunded" }));
        setSuccess(getLocalizedText("refundSuccessful", "refundAutomation"));
      } else {
        setError(
          getLocalizedText("refundFailed", "refundAutomation", {
            reason: refundResponse.reason || "unknown",
          })
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
            <strong>{getLocalizedText("orderAmount", "refundAutomation")}: </strong>
            {formatCurrency(order.amount, order.currency)}
          </p>
          <p>
            <strong>{getLocalizedText("orderStatus", "refundAutomation")}: </strong>
            {getLocalizedText(order.status, "refundAutomation")}
          </p>
          {order.status === "Completed" && (
            <button
              className="refund-button"
              onClick={handleRefundRequest}
              disabled={loading}
            >
              {getLocalizedText("requestRefund", "refundAutomation")}
            </button>
          )}
          {order.status === "Refunded" && (
            <p>{getLocalizedText("refundProcessed", "refundAutomation")}</p>
          )}
        </div>
      ) : (
        <p>{getLocalizedText("orderNotAvailable", "refundAutomation")}</p>
      )}
    </div>
  );
};

export default ReturnAndRefund;
