import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Table, Button, Spin, Alert, Modal, Input, Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "redux/store";
import { fetchB2BPricing, updateB2BPricing } from "@/redux/slices/marketing/b2bSlice";
import { fetchC2CListings, updateC2CListing } from "@/redux/slices/marketing/c2cSlice";
import { getLocalizedText } from "utils/localizationUtils";

const { Option } = Select;

const PricePromotionContainer = styled.div`
  padding: 20px;
`;

const PriceAndPromotion: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [editingItem, setEditingItem] = useState<any>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [isB2B, setIsB2B] = useState(true);

  const { pricing, loading: b2bLoading, error: b2bError } = useSelector((state: RootState) => state.b2b);
  const { listings, loading: c2cLoading, error: c2cError } = useSelector((state: RootState) => state.c2c);

  useEffect(() => {
    if (isB2B) {
      dispatch(fetchB2BPricing("seller-id-placeholder")); // Replace with actual seller ID
    } else {
      dispatch(fetchC2CListings("seller-id-placeholder"));
    }
  }, [dispatch, isB2B]);

  const handleEditItem = (item: any) => {
    setEditingItem(item);
    setEditModalVisible(true);
  };

  const handleSaveChanges = async () => {
    if (editingItem) {
      if (isB2B) {
        await dispatch(updateB2BPricing({ sellerId: "seller-id-placeholder", pricing: editingItem }));
      } else {
        await dispatch(updateC2CListing({ listingId: editingItem.id, updates: editingItem }));
      }
      setEditModalVisible(false);
      setEditingItem(null);
    }
  };

  const columns = [
    {
      title: getLocalizedText("Name", "pricing"),
      dataIndex: "name",
      key: "name",
    },
    {
      title: getLocalizedText("Price", "pricing"),
      dataIndex: "price",
      key: "price",
    },
    {
      title: getLocalizedText("Category", "pricing"),
      dataIndex: "category",
      key: "category",
    },
    {
      title: getLocalizedText("Actions", "pricing"),
      key: "actions",
      render: (_: any, record: any) => (
        <Button type="link" onClick={() => handleEditItem(record)}>
          {getLocalizedText("Edit", "pricing")}
        </Button>
      ),
    },
  ];

  const dataSource = isB2B ? pricing : listings;
  const loading = isB2B ? b2bLoading : c2cLoading;
  const error = isB2B ? b2bError : c2cError;

  return (
    <PricePromotionContainer>
      <h2>{getLocalizedText("Price and Promotion Management", "pricing")}</h2>

      <Button onClick={() => setIsB2B(!isB2B)} type="primary" style={{ marginBottom: 20 }}>
        {isB2B
          ? getLocalizedText("Switch to C2C Listings", "pricing")
          : getLocalizedText("Switch to B2B Pricing", "pricing")}
      </Button>

      {loading && <Spin />}
      {error && <Alert message={error} type="error" />}

      <Table dataSource={dataSource} columns={columns} rowKey="id" pagination={{ pageSize: 10 }} />

      <Modal
        title={getLocalizedText("Edit Item", "pricing")}
        visible={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        onOk={handleSaveChanges}
      >
        {editingItem && (
          <div>
            <label>{getLocalizedText("Name", "pricing")}</label>
            <Input
              value={editingItem.name}
              onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
            />

            <label>{getLocalizedText("Price", "pricing")}</label>
            <Input
              type="number"
              value={editingItem.price}
              onChange={(e) => setEditingItem({ ...editingItem, price: Number(e.target.value) })}
            />

            <label>{getLocalizedText("Category", "pricing")}</label>
            <Select
              value={editingItem.category}
              onChange={(value) => setEditingItem({ ...editingItem, category: value })}
              style={{ width: "100%" }}
            >
              <Option value="B2B">{getLocalizedText("B2B", "pricing")}</Option>
              <Option value="C2C">{getLocalizedText("C2C", "pricing")}</Option>
              <Option value="B2C">{getLocalizedText("B2C", "pricing")}</Option>
            </Select>
          </div>
        )}
      </Modal>
    </PricePromotionContainer>
  );
};

export default PriceAndPromotion;
