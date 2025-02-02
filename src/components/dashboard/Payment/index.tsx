import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import BillingSummary from "./BillingSummary";
import PaymentHistory from "./PaymentHistory";
import PaymentManagement from "./PaymentManagement";

// Escrow Management Components
import DisputeAssistance from "./EscrowManagement/DisputeAssistance";
import DisputeResolution from "./EscrowManagement/DisputeResolution";
import EscrowAnalytics from "./EscrowManagement/EscrowAnalytics";
import EscrowDashboard from "./EscrowManagement/EscrowDashboard";
import EscrowNotificationSystem from "./EscrowManagement/EscrowNotificationSystem";
import FileUploader from "./EscrowManagement/FileUploader";
import PerformanceMetrics from "./EscrowManagement/PerformanceMetrics";

// Payout Preferences Components
import AddPaymentMethodForm from "./PayoutPreferences/AddPaymentMethodForm";
import EditPaymentMethodForm from "./PayoutPreferences/EditPaymentMethodForm";
import PaymentMethodsPage from "./PayoutPreferences/PaymentMethodsPage";
import PayoutPreferencesPage from "./PayoutPreferences/PayoutPreferencesPage";

// Transaction History Components
import TransactionDetails from "./TransactionHistory/TransactionDetails";
import TransactionHistoryPage from "./TransactionHistory/TransactionHistoryPage";

import { RootState, AppDispatch } from "../../../redux/store";
import { fetchTransactionDetails } from "../../../redux/slices/orders/transactionSlice";
import { submitEvidence } from "../../../redux/slices/orders/escrowSlice";

const Payment: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [transactionDetails, setTransactionDetails] = useState<any>(null);

  // Redux Selectors
  const selectedTransactionId = useSelector(
    (state: RootState) => state.transaction?.selectedTransaction // Assume this is the ID
  );
  const selectedPaymentMethodId = useSelector(
    (state: RootState) => state.payments?.selectedPaymentMethod // Corrected selector
  );

  // Fetch full transaction details if only ID is available
  useEffect(() => {
    const fetchTransaction = async () => {
      if (selectedTransactionId) {
        const transaction = await dispatch(fetchTransactionDetails(selectedTransactionId)).unwrap();
        setTransactionDetails(transaction);
      }
    };
    fetchTransaction();
  }, [dispatch, selectedTransactionId]);

  if (!selectedPaymentMethodId) {
    return <p>No Payment Method Selected</p>;
  }
  if (!selectedTransactionId || !transactionDetails) {
    return <p>No Transaction Selected</p>;
  }

  // Define the `onUpload` handler for FileUploader
  const handleFileUpload = async (files: File[]) => {
    try {
      const formData = new FormData();
      formData.append("transactionId", selectedTransactionId); // Use ID directly
      files.forEach((file) => formData.append("files", file));

      await dispatch(submitEvidence(formData)).unwrap();
      alert("Files uploaded successfully!");
    } catch (error) {
      alert(`Error uploading files: ${error}`);
    }
  };

  return (
    <div>
      {/* Payment Summary Components */}
      <BillingSummary />
      <PaymentHistory />
      <PaymentManagement />

      {/* Escrow Management */}
      <EscrowDashboard />
      <EscrowAnalytics />
      <DisputeAssistance transactionId={selectedTransactionId} />
      <DisputeResolution transaction={transactionDetails} /> {/* Use full transaction object */}
      <EscrowNotificationSystem />
      <FileUploader onUpload={handleFileUpload} />
      <PerformanceMetrics />

      {/* Payout Preferences */}
      <PaymentMethodsPage />
      <PayoutPreferencesPage />
      <AddPaymentMethodForm />
      <EditPaymentMethodForm paymentMethodId={selectedPaymentMethodId} />

      {/* Transaction History */}
      <TransactionHistoryPage />
      <TransactionDetails transactionId={selectedTransactionId} />
    </div>
  );
};

export default Payment;
