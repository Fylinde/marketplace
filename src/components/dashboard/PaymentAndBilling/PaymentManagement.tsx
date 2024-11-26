import React, { useState, useEffect } from "react";
import Box from "components/Box";
import Table from "components/table/Table";
import Input from "components/input/Input";
import Button from "components/buttons/Button";
import Modal from "components/modal/Modal";
import Select from "@/components/Select";
import { SelectOption } from "@/types/selectOption";
import Toggle from "components/toggle/Toggle";
import { useAppDispatch, useAppSelector } from "../../../redux/slices/reduxHooks";
import {
  fetchPaymentData,
  fetchPaymentMethods,
  updateSellerCurrency,
  toggleCryptoAcceptance,
  updatePaymentMethod,
  deletePaymentMethod,
  createPaymentMethod,
} from "../../../redux/slices/paymentSlice";
import { RootState } from "../../../redux/store";
import { PaymentMethod } from "types/sharedTypes";
import { validateString } from "../../../services/validationService";

const PaymentManagement: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    paymentMethods,
    transactions: paymentData,
    escrowTransactions: escrowDetails,
    sellerCurrency,
    cryptoAcceptance,
    loading,
    error,
  } = useAppSelector((state: RootState) => state.payments);

  const [preferredCurrency, setPreferredCurrency] = useState(sellerCurrency);
  const [filters, setFilters] = useState({ methodType: "All", currency: "All" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentPaymentMethod, setCurrentPaymentMethod] = useState<Partial<PaymentMethod>>({});

  // Fetch payment data and methods on mount
  useEffect(() => {
    dispatch(fetchPaymentData());
    dispatch(fetchPaymentMethods());
  }, [dispatch]);

  // Handle saving/updating payment methods
  const handleSavePaymentMethod = () => {
    const { name, type, currency } = currentPaymentMethod;

    if (!name || !type || !currency) {
      alert("All fields are required.");
      return;
    }

    if (!validateString(name, "Name", 3)) {
      alert("Name must be at least 3 characters long.");
      return;
    }

    if (editMode && currentPaymentMethod.id) {
      dispatch(
        updatePaymentMethod({
          id: currentPaymentMethod.id,
          updates: { name, type, currency },
        })
      )
        .unwrap()
        .then(() => {
          alert("Payment method updated successfully.");
          setIsModalOpen(false);
          setCurrentPaymentMethod({});
        })
        .catch(() => alert("Failed to update the payment method."));
    } else {
      dispatch(createPaymentMethod(currentPaymentMethod as PaymentMethod))
        .unwrap()
        .then(() => {
          alert("Payment method added successfully.");
          setIsModalOpen(false);
          setCurrentPaymentMethod({});
        })
        .catch(() => alert("Failed to add the payment method."));
    }
  };

  // Handle deleting a payment method
  const handleDeletePaymentMethod = (id: string) => {
    if (window.confirm("Are you sure you want to delete this payment method?")) {
      dispatch(deletePaymentMethod(id))
        .unwrap()
        .then(() => alert("Payment method deleted successfully."))
        .catch(() => alert("Failed to delete the payment method."));
    }
  };

  // Handle currency change
  const handleCurrencyChange = (option: SelectOption) => {
    const currency = option.value as string;
    setPreferredCurrency(currency);
    dispatch(updateSellerCurrency(currency));
  };

  // Toggle crypto acceptance
  const handleCryptoToggle = () => {
    dispatch(toggleCryptoAcceptance());
  };

  // Filter payment methods
  const filteredPaymentMethods = paymentMethods.filter((method) => {
    const matchesType = filters.methodType === "All" || method.type === filters.methodType;
    const matchesCurrency = filters.currency === "All" || method.currency === filters.currency;
    return matchesType && matchesCurrency;
  });

  return (
    <Box>
      <h1>Payment Management</h1>

      {/* Seller's Preferred Currency */}
      <Box mb="20px">
        <h3>Preferred Currency</h3>
        <Select
          value={{ label: preferredCurrency, value: preferredCurrency }}
          options={[
            { value: "USD", label: "USD - US Dollar" },
            { value: "CNY", label: "CNY - Chinese Yuan" },
            { value: "EUR", label: "EUR - Euro" },
          ]}
          onChange={(option) => handleCurrencyChange(option as SelectOption)}
        />
      </Box>

      {/* Crypto Payment Toggle */}
      <Box mb="20px">
        <h3>Accept Crypto Payments</h3>
        <Toggle
          isChecked={cryptoAcceptance}
          onChange={handleCryptoToggle}
          label="Allow buyers to pay in cryptocurrency"
        />
      </Box>

      {/* Filters for Payment Methods */}
      <Box display="flex" justifyContent="space-between" mb="20px">
        <Select
          label="Payment Type"
          value={{ value: filters.methodType, label: filters.methodType }}
          options={[
            { value: "All", label: "All" },
            { value: "Credit Card", label: "Credit Card" },
            { value: "Bank Transfer", label: "Bank Transfer" },
            { value: "Crypto", label: "Crypto" },
          ]}
          onChange={(option) =>
            setFilters((prev) => ({ ...prev, methodType: (option as SelectOption).value }))
          }
        />
        <Select
          label="Currency"
          value={{ value: filters.currency, label: filters.currency }}
          options={[
            { value: "All", label: "All" },
            { value: "USD", label: "USD" },
            { value: "EUR", label: "EUR" },
            { value: "BTC", label: "BTC" },
            { value: "ETH", label: "ETH" },
          ]}
          onChange={(option) =>
            setFilters((prev) => ({ ...prev, currency: (option as SelectOption).value }))
          }
        />
        <Button onClick={() => setIsModalOpen(true)}>Add Payment Method</Button>
      </Box>

      {/* Payment Methods Table */}
      <Box mb="20px">
        <h3>Payment Methods</h3>
        <Table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Currency</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPaymentMethods.map((method) => (
              <tr key={method.id}>
                <td>{method.name}</td>
                <td>{method.type}</td>
                <td>{method.currency}</td>
                <td>
                  <Button
                    onClick={() => {
                      setEditMode(true);
                      setCurrentPaymentMethod(method);
                      setIsModalOpen(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button onClick={() => handleDeletePaymentMethod(method.id)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Box>

      {/* Escrow Section */}
      <Box>
        <h3>Escrow Transactions</h3>
        <Table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Buyer Name</th>
              <th>Amount (Buyer Currency)</th>
              <th>Escrow Status</th>
              <th>Release Date</th>
            </tr>
          </thead>
          <tbody>
            {escrowDetails.map((escrow) => (
              <tr key={escrow.orderId}>
                <td>{escrow.orderId}</td>
                <td>{escrow.buyerName}</td>
                <td>
                  {escrow.amount} {escrow.buyerCurrency}
                </td>
                <td>{escrow.status}</td>
                <td>{escrow.releaseDate}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Box>

      {/* Payment Data Table */}
      <Box>
        <h3>Payment Transactions</h3>
        <Table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Buyer Currency</th>
              <th>Amount (Buyer Currency)</th>
              <th>Converted Amount (Seller Currency)</th>
              <th>Exchange Fee</th>
              <th>Payment Method</th>
            </tr>
          </thead>
          <tbody>
          {paymentData.map((transaction) => (
              <tr key={transaction.orderId}>
                <td>{transaction.orderId}</td>
                <td>{transaction.buyerCurrency}</td>
                <td>{transaction.buyerAmount.toFixed(2)}</td>
                <td>
                  {transaction.sellerAmount.toFixed(2)} {transaction.sellerCurrency}
                </td>
                <td>
                  {transaction.exchangeFee.toFixed(2)} {transaction.sellerCurrency}
                </td>
                <td>{transaction.paymentMethod}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Box>

      {/* Add/Edit Payment Method Modal */}
      {isModalOpen && (
        <Modal
          title={editMode ? "Edit Payment Method" : "Add Payment Method"}
          open={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setCurrentPaymentMethod({});
          }}
        >
          <Box display="flex" flexDirection="column" gap="10px">
            <Input
              label="Name"
              value={currentPaymentMethod.name || ""}
              onChange={(e) =>
                setCurrentPaymentMethod({ ...currentPaymentMethod, name: e.target.value })
              }
            />
            <Select
              label="Type"
              value={{
                value: currentPaymentMethod.type || "",
                label: currentPaymentMethod.type || "Select Type",
              }}
              options={[
                { value: "Credit Card", label: "Credit Card" },
                { value: "Bank Transfer", label: "Bank Transfer" },
                { value: "Crypto", label: "Crypto" },
              ]}
              onChange={(option) =>
                setCurrentPaymentMethod({
                  ...currentPaymentMethod,
                  type: (option as SelectOption).value,
                })
              }
            />
            <Select
              label="Currency"
              value={{
                value: currentPaymentMethod.currency || "",
                label: currentPaymentMethod.currency || "Select Currency",
              }}
              options={[
                { value: "USD", label: "USD - US Dollar" },
                { value: "EUR", label: "EUR - Euro" },
                { value: "BTC", label: "BTC - Bitcoin" },
                { value: "ETH", label: "ETH - Ethereum" },
              ]}
              onChange={(option) =>
                setCurrentPaymentMethod({
                  ...currentPaymentMethod,
                  currency: (option as SelectOption).value,
                })
              }
            />
            <Button onClick={handleSavePaymentMethod}>
              {editMode ? "Update Payment Method" : "Add Payment Method"}
            </Button>
          </Box>
        </Modal>
      )}

      {/* Loading and Error Messages */}
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
    </Box>
  );
};

export default PaymentManagement;
