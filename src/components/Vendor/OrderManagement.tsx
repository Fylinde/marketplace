// src/components/Vendor/OrderManagement.tsx

import React from 'react';
import './Vendor.css';

interface Order {
  id: string;
  customer: string;
  product: string;
  status: string;
}

const orders: Order[] = [
  {
    id: '12345',
    customer: 'John Doe',
    product: 'Product 1',
    status: 'Pending',
  },
  // Add more orders here
];

const OrderManagement: React.FC = () => {
  return (
    <div className="order-management">
      <h2>Order Management</h2>
      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Product</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.customer}</td>
              <td>{order.product}</td>
              <td>{order.status}</td>
              <td><button>Mark as Shipped</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderManagement;
