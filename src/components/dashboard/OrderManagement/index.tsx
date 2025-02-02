import React from "react";
import { useSelector } from "react-redux";
import TaxPreviewWidget from "./widgets/TaxPreviewWidget";
import AnalyticDashboard from "./AnalyticsDashboard";
import AutomatedOrderRules from "./AutomatedOrderRules";
import BulkOrderProcessing from "./BulkOrderProcessing";
import CancellationManagement from "./CancellationManagement";
import CustomerMessaging from "./CustomerMessaging";
import DisputeManagement from "./DisputeManagement";
import FeedbackAndRatings from "./FeedbackAndRatings";
import FraudDetectionAndPrevention from "./FraudDetectionAndPrevention";
import FulfillmentOptions from "./FulfillmentOptions";
import NotificationsCenter from "./NotificationsCenter";
import OrderDetails from "./OrderDetails";
import OrderHistory from "./OrderHistory";
import OrderPrioritization from "./OrderPrioritization";
import PackagingGuidelines from "./PackagingGuidelines";
import RefundAutomation from "./RefundAutomation";
import ReturnAndRefund from "./ReturnAndRefund"; // Correct path for widgets
import ReturnProcessing from "./ReturnProcessing";
import SLAComplianceTracker from "./SLAComplianceTracker";
import TaxCompliance from "./TaxCompliance";
import { RootState } from "../../../redux/store";

const OrderManagement: React.FC = () => {
  // Dynamically retrieve `orderId` from Redux store via `selectedOrder`
  const selectedOrder = useSelector((state: RootState) => state.orders.selectedOrder);
  const orderId = selectedOrder?.id; // Extract `orderId` if `selectedOrder` exists

  if (!orderId) {
    return <p>No Order Selected</p>; // Gracefully handle missing `orderId`
  }

  return (
    <div>
      {/* Example Widgets */}
      <TaxPreviewWidget
        items={[
          { category: "Electronics", price: 500 },
          { category: "Books", price: 50 },
        ]}
        country="US"
        currency="USD"
      />
      <AnalyticDashboard />
      <AutomatedOrderRules />
      <BulkOrderProcessing />
      <CancellationManagement />
      <CustomerMessaging />
      <DisputeManagement />
      <FeedbackAndRatings />
      <FraudDetectionAndPrevention />
      <FulfillmentOptions />
      <NotificationsCenter />
      <OrderDetails />
      <OrderHistory />
      <OrderPrioritization />
      <PackagingGuidelines />
      <RefundAutomation />
      <ReturnAndRefund orderId={orderId} /> {/* Dynamically pass `orderId` */}
      <ReturnProcessing />
      <SLAComplianceTracker />
      <TaxCompliance />
    </div>
  );
};

export default OrderManagement;