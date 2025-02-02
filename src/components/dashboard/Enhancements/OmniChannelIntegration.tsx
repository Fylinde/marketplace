import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import {
  fetchProducts,
  fetchInventory,
  fetchOrders,
  syncInventory,
} from "../../../redux/slices/products/omniChannelSlice"; // Redux slice actions
import { getLocalizedText } from "../../../utils/localizationUtils";
import type { AppDispatch, RootState } from "../../../redux/store";
import { Product } from "@/types/Product";



// Styled-components for responsiveness
const Container = styled.div`
  padding: 20px;
  @media (max-width: 768px) {
    padding: 15px;
  }
  @media (max-width: 480px) {
    padding: 10px;
  }
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 20px;
  text-align: center;
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
  @media (max-width: 480px) {
    font-size: 1.2rem;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 15px;
  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  background-color: #fff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  h3 {
    font-size: 1.25rem;
    margin-bottom: 10px;
  }

  p {
    font-size: 0.9rem;
    color: #555;
  }

  button {
    margin-top: 10px;
    padding: 10px 15px;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
      background-color: #0056b3;
    }
  }

  @media (max-width: 768px) {
    h3 {
      font-size: 1rem;
    }
    p {
      font-size: 0.8rem;
    }
    button {
      padding: 8px 12px;
      font-size: 0.9rem;
    }
  }
`;
const OmniChannelIntegration: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  // Select data from Redux store
  const { products, inventory, orders, loading, error } = useSelector(
    (state: RootState) => state.omniChannel
  );

  // Fetch data on component mount
  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchInventory());
    dispatch(fetchOrders());
  }, [dispatch]);

  // Handle inventory synchronization
  const handleSyncInventory = (inventoryId: string) => {
    dispatch(syncInventory(inventoryId));
  };

  return (
    <Container>
      <Title>{getLocalizedText("omniChannelIntegration", "dashboard")}</Title>

      {loading && <p>{getLocalizedText("loading", "common")}</p>}
      {error && (
        <p style={{ color: "red" }}>
          {getLocalizedText("error", "common")}: {error}
        </p>
      )}

      {/* Products Section */}
      <SectionTitle>{getLocalizedText("products", "dashboard")}</SectionTitle>
      <Grid>
        {products.map((product) => (
          <Card key={product.id}>
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p>
              {getLocalizedText("price", "dashboard")}: ${product.price}
            </p>
          </Card>
        ))}
      </Grid>

      {/* Inventory Section */}
      <SectionTitle>{getLocalizedText("inventory", "dashboard")}</SectionTitle>
      <Grid>
        {inventory.map((item) => (
          <Card key={item.id}>
            <h3>{item.name}</h3>
            <p>
              {getLocalizedText("quantity", "dashboard")}: {item.quantity}
            </p>
            <p>
              {getLocalizedText("location", "dashboard")}: {item.location}
            </p>
            <button onClick={() => handleSyncInventory(item.id)}>
              {getLocalizedText("syncInventory", "dashboard")}
            </button>
          </Card>
        ))}
      </Grid>

      {/* Orders Section */}
      <SectionTitle>{getLocalizedText("orders", "dashboard")}</SectionTitle>
      <Grid>
        {orders.map((order) => (
          <Card key={order.id}>
            <h3>
              {getLocalizedText("orderID", "dashboard")}: {order.id}
            </h3>
            <p>
              {getLocalizedText("status", "dashboard")}: {order.status}
            </p>
            <p>
              {getLocalizedText("total", "dashboard")}: ${order.total}
            </p>
          </Card>
        ))}
      </Grid>
    </Container>
  );
};

export default OmniChannelIntegration;