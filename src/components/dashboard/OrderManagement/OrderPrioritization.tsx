import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "redux/slices/reduxHooks";
import { fetchOrders } from "redux/slices/orderSlice";
import Box from "components/Box";
import Table from "components/table/Table";
import Input from "components/input/Input";
import Pagination from "components/pagination/Pagination";
import Button from "components/buttons/Button";
import Modal from "components/modal/Modal";
import { Order } from "types/order";

const OrderPrioritization: React.FC = () => {
  const dispatch = useAppDispatch();
  const ordersFromRedux = useAppSelector((state) => state.orders.orders) as Order[];
  const isLoading = useAppSelector((state) => state.orders.loading);

  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [itemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOption, setSortOption] = useState<"priority" | "proximity" | "deliverySpeed">("priority");
  const [filterProximityRange, setFilterProximityRange] = useState<[number, number] | null>(null);
  const [filterDeliverySpeed, setFilterDeliverySpeed] = useState<"Fast" | "Normal" | "All">("All");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [message, setMessage] = useState("");

  // Fetch orders from Redux store
  useEffect(() => {
    dispatch(fetchOrders({ page: 1, filters: {}, sort: sortOption }));
  }, [dispatch, sortOption]);

  // Set orders from Redux when available
  useEffect(() => {
    setOrders(ordersFromRedux);
  }, [ordersFromRedux]);

  // Dynamic prioritization logic
  const prioritizeOrders = (orders: Order[]): Order[] => {
    return [...orders].sort((a, b) => {
      if (sortOption === "priority") {
        if (a.priority === "VIP" && b.priority !== "VIP") return -1;
        if (b.priority === "VIP" && a.priority !== "VIP") return 1;
      } else if (sortOption === "proximity") {
        return a.proximity - b.proximity;
      } else if (sortOption === "deliverySpeed") {
        if (a.deliverySpeed === "Fast" && b.deliverySpeed !== "Fast") return -1;
        if (b.deliverySpeed === "Fast" && a.deliverySpeed !== "Fast") return 1;
      }
      return 0;
    });
  };

  const filteredOrders = prioritizeOrders(
    orders.filter((order) => {
      const matchesSearch = order.customerName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesProximity =
        !filterProximityRange ||
        (order.proximity >= filterProximityRange[0] && order.proximity <= filterProximityRange[1]);
      const matchesDeliverySpeed = filterDeliverySpeed === "All" || order.deliverySpeed === filterDeliverySpeed;
      return matchesSearch && matchesProximity && matchesDeliverySpeed;
    })
  );

  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle order actions (e.g., update priority or send message)
  const handleUpdatePriority = (order: Order, newPriority: string) => {
    const updatedOrders = orders.map((o) =>
      o.id === order.id ? { ...o, priority: newPriority } : o
    );
    setOrders(updatedOrders);
  };

  const handleSendMessage = () => {
    if (!message.trim() || !selectedOrder) return;
    alert(`Message sent to ${selectedOrder.customerName}: ${message}`);
    setMessage("");
    setSelectedOrder(null);
  };

  return (
    <Box>
      <h2>Order Prioritization</h2>

      {/* Search, Filters, and Sorting */}
      <Box display="flex" justifyContent="space-between" mb="20px">
        <Input
          label="Search Orders"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by customer name"
        />
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value as any)}
        >
          <option value="priority">Priority</option>
          <option value="proximity">Proximity</option>
          <option value="deliverySpeed">Delivery Speed</option>
        </select>
        <Input
          label="Proximity Range (e.g., 5-20)"
          placeholder="Enter range"
          value={
            filterProximityRange
              ? `${filterProximityRange[0]}-${filterProximityRange[1]}`
              : ""
          }
          onChange={(e) => {
            const [min, max] = e.target.value.split("-").map(Number);
            setFilterProximityRange([min, max]);
          }}
        />
        <select
          value={filterDeliverySpeed}
          onChange={(e) => setFilterDeliverySpeed(e.target.value as any)}
        >
          <option value="All">All Speeds</option>
          <option value="Fast">Fast</option>
          <option value="Normal">Normal</option>
        </select>
      </Box>

      {/* Table */}
      {isLoading ? (
        <p>Loading orders...</p>
      ) : (
        <Table>
          <thead>
            <tr>
              <th>Customer Name</th>
              <th>Priority</th>
              <th>Proximity (km)</th>
              <th>Delivery Speed</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedOrders.map((order) => (
              <tr key={order.id}>
                <td>{order.customerName}</td>
                <td>{order.priority}</td>
                <td>{order.proximity}</td>
                <td>{order.deliverySpeed}</td>
                <td>
                  <Button onClick={() => handleUpdatePriority(order, "VIP")}>
                    Mark as VIP
                  </Button>
                  <Button onClick={() => setSelectedOrder(order)}>Message</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Pagination */}
      <Pagination
        pageCount={Math.ceil(filteredOrders.length / itemsPerPage)}
        onChange={({ selected }) => setCurrentPage(selected + 1)}
        forcePage={currentPage - 1}
      />

      {/* Message Modal */}
      {selectedOrder && (
        <Modal
          title={`Send Message to ${selectedOrder.customerName}`}
          open={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
        >
          <Box>
            <Input
              label="Message"
              value={message}
              placeholder="Type your message here"
              onChange={(e) => setMessage(e.target.value)}
            />
            <Button onClick={handleSendMessage}>Send</Button>
          </Box>
        </Modal>
      )}
    </Box>
  );
};

export default OrderPrioritization;
