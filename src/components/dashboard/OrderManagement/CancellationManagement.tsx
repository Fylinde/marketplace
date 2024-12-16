import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchOrders,
  updateOrderStatus,
  requestRefund,
} from "../../../redux/slices/orders/orderSlice";
import { getLocalizedText } from "../../../utils/localizationUtils";
import type { AppDispatch, RootState } from "../../../redux/store";
import {
  Container,
  Section,
  Title,
  Subtitle,
  OrderList,
  OrderItem,
  TextArea,
  Button,
  InsightsContainer,
  InsightsList,
  InsightsItem,
  AuditTrailContainer,
} from "./styles/CancellationManagementStyles";

const CancellationManagement = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { orders, loading, error } = useSelector((state: RootState) => state.orders);

  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [cancellationReason, setCancellationReason] = useState<string>("");
  const [cancellationStats, setCancellationStats] = useState<Record<string, number>>({});

  useEffect(() => {
    dispatch(fetchOrders({ page: 1, filters: {}, sort: "date" }));
    setCancellationStats({
      "Out of stock": 45,
      "Customer request": 30,
      "Delayed delivery": 25,
      "Other": 20,
    });
  }, [dispatch]);

  const handleSelectOrder = (orderId: string) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleBulkCancelOrders = async () => {
    if (selectedOrders.length === 0 || !cancellationReason) {
      alert(getLocalizedText("selectOrdersAndReason", "cancellationManagement"));
      return;
    }

    try {
      for (const orderId of selectedOrders) {
        await dispatch(
          updateOrderStatus({
            orderId,
            status: "Cancelled", // Use the correct case-sensitive status
          })
        ).unwrap();

        await dispatch(
          requestRefund({
            orderId,
            reason: cancellationReason,
          })
        ).unwrap();

        console.log(`Email notification sent for Order ID: ${orderId}`);
      }

      alert(getLocalizedText("ordersCancelledSuccessfully", "cancellationManagement"));
      setSelectedOrders([]);
      setCancellationReason("");
    } catch (error) {
      const errorMessage =
        (error as Error)?.message || getLocalizedText("unknownError", "common");
      alert(
        getLocalizedText("bulkCancellationFailed", "cancellationManagement", { error: errorMessage })
      );
    }
  };

  const renderCancellationInsights = () => (
    <InsightsContainer>
      <Subtitle>{getLocalizedText("cancellationInsights", "cancellationManagement")}</Subtitle>
      <InsightsList>
        {Object.entries(cancellationStats).map(([reason, count]) => (
          <InsightsItem key={reason}>
            {reason}: {count} cancellations
          </InsightsItem>
        ))}
      </InsightsList>
    </InsightsContainer>
  );

  const renderAuditTrail = () => (
    <AuditTrailContainer>
      <Subtitle>{getLocalizedText("auditTrail", "cancellationManagement")}</Subtitle>
      <p>{getLocalizedText("auditTrailDescription", "cancellationManagement")}</p>
    </AuditTrailContainer>
  );

  if (loading) return <p>{getLocalizedText("loading", "common")}</p>;
  if (error)
    return (
      <p>
        {getLocalizedText("errorFetchingOrders", "cancellationManagement", {
          error:
            typeof error === "object" && error !== null && "message" in error
              ? String((error as { message: string }).message)
              : typeof error === "string"
                ? error
                : getLocalizedText("unknownError", "common"),
        })}
      </p>
    );

  return (
    <Container>
      <Title>{getLocalizedText("cancellationManagement", "cancellationManagement")}</Title>
      <Section>
        <Subtitle>{getLocalizedText("selectOrdersToCancel", "cancellationManagement")}</Subtitle>
        <OrderList>
          {orders.map((order) => (
            <OrderItem key={order.id}>
              <label>
                <input
                  type="checkbox"
                  value={order.id}
                  checked={selectedOrders.includes(order.id)}
                  onChange={() => handleSelectOrder(order.id)}
                />
                {`${getLocalizedText("orderId", "common")}: ${order.id} - ${getLocalizedText(
                  "status",
                  "common"
                )}: ${order.status}`}
              </label>
            </OrderItem>
          ))}
        </OrderList>
      </Section>
      <Section>
        <Subtitle>{getLocalizedText("provideCancellationReason", "cancellationManagement")}</Subtitle>
        <TextArea
          value={cancellationReason}
          onChange={(e) => setCancellationReason(e.target.value)}
          placeholder={getLocalizedText("reasonPlaceholder", "cancellationManagement")}
        />
      </Section>
      <Button onClick={handleBulkCancelOrders} disabled={selectedOrders.length === 0}>
        {getLocalizedText("cancelOrders", "cancellationManagement")}
      </Button>
      {renderCancellationInsights()}
      {renderAuditTrail()}
    </Container>
  );
};

export default CancellationManagement;
