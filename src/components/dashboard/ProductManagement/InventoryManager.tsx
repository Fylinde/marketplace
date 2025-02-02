import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { Table, Button, Spin, Alert, Modal, Input, Select, Tooltip } from "antd";
import { AppDispatch, RootState } from "../../../redux/store";
import { fetchInventory, updateInventory } from "../../../redux/slices/products/inventorySlice";
import { fetchB2BPricing } from "../../../redux/slices/marketing/b2bSlice";
import { fetchC2CListings } from "../../../redux/slices/marketing/c2cSlice";
import { getLocalizedText } from "../../../utils/localizationUtils";

const { Option } = Select;

const InventoryContainer = styled.div`
  padding: 20px;
`;

const InventoryManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);

  const { inventory, loading, error } = useSelector((state: RootState) => state.inventory);
  const b2bPricing = useSelector((state: RootState) => state.b2b.pricing);
  const c2cListings = useSelector((state: RootState) => state.c2c.listings);

  useEffect(() => {
    dispatch(fetchInventory("seller-id-placeholder")); // Replace with actual seller ID logic
    dispatch(fetchB2BPricing("seller-id-placeholder")); // Fetch B2B pricing
    dispatch(fetchC2CListings("seller-id-placeholder")); // Fetch C2C listings
  }, [dispatch]);

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    setEditModalVisible(true);
  };

  const handleSaveChanges = async () => {
    if (editingProduct) {
      await dispatch(updateInventory({ productId: editingProduct.id, updates: editingProduct }));
      setEditModalVisible(false);
      setEditingProduct(null);
    }
  };

  const columns = [
    {
      title: getLocalizedText("Product Name", "inventory"),
      dataIndex: "name",
      key: "name",
    },
    {
      title: getLocalizedText("Stock", "inventory"),
      dataIndex: "stock",
      key: "stock",
    },
    {
      title: getLocalizedText("Price", "inventory"),
      dataIndex: "price",
      key: "price",
    },
    {
      title: getLocalizedText("Category", "inventory"),
      dataIndex: "category",
      key: "category",
    },
    {
      title: getLocalizedText("Actions", "inventory"),
      key: "actions",
      render: (_: any, record: any) => (
        <Button type="link" onClick={() => handleEditProduct(record)}>
          {getLocalizedText("Edit", "inventory")}
        </Button>
      ),
    },
  ];

  const b2bColumns = [
    {
      title: getLocalizedText("B2B Product", "b2b"),
      dataIndex: "productName",
      key: "productName",
    },
    {
      title: getLocalizedText("B2B Price", "b2b"),
      dataIndex: "price",
      key: "price",
    },
  ];

  const c2cColumns = [
    {
      title: getLocalizedText("C2C Listing", "c2c"),
      dataIndex: "listingName",
      key: "listingName",
    },
    {
      title: getLocalizedText("C2C Price", "c2c"),
      dataIndex: "price",
      key: "price",
    },
  ];

  return (
    <InventoryContainer>
      <h2>{getLocalizedText("Inventory Management", "inventory")}</h2>

      {loading && <Spin />}
      {error && <Alert message={error} type="error" />}

      <Table
        dataSource={inventory}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />

      {/* B2B Pricing Table */}
      <h3>{getLocalizedText("B2B Pricing", "b2b")}</h3>
      <Table
        dataSource={b2bPricing}
        columns={b2bColumns}
        rowKey="id"
        pagination={{ pageSize: 5 }}
      />

      {/* C2C Listings Table */}
      <h3>{getLocalizedText("C2C Listings", "c2c")}</h3>
      <Table
        dataSource={c2cListings}
        columns={c2cColumns}
        rowKey="id"
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title={getLocalizedText("Edit Product", "inventory")}
        visible={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        onOk={handleSaveChanges}
      >
        {editingProduct && (
          <div>
            <label>{getLocalizedText("Product Name", "inventory")}</label>
            <Input
              value={editingProduct.name}
              onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
            />

            <label>{getLocalizedText("Stock", "inventory")}</label>
            <Input
              type="number"
              value={editingProduct.stock}
              onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
            />

            <label>{getLocalizedText("Price", "inventory")}</label>
            <Input
              type="number"
              value={editingProduct.price}
              onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
            />

            <label>{getLocalizedText("Category", "inventory")}</label>
            <Select
              value={editingProduct.category}
              onChange={(value) => setEditingProduct({ ...editingProduct, category: value })}
              style={{ width: "100%" }}
            >
              <Option value="B2B">{getLocalizedText("B2B", "inventory")}</Option>
              <Option value="C2C">{getLocalizedText("C2C", "inventory")}</Option>
              <Option value="B2C">{getLocalizedText("B2C", "inventory")}</Option>
            </Select>

            <Tooltip title={getLocalizedText("Update inventory to reflect changes", "inventory")}>
              <span>{getLocalizedText("Note", "inventory")}:</span> {getLocalizedText("Ensure all fields are accurate", "inventory")}
            </Tooltip>
          </div>
        )}
      </Modal>
    </InventoryContainer>
  );
};

export default InventoryManagement;
