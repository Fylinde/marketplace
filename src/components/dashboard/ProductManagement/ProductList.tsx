import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Table, Button, Spin, Alert, Input, Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import { fetchProducts, removeProduct } from "../../../redux/slices/products/productSlice";
import { getLocalizedText } from "../../../utils/localizationUtils";
import DeleteProduct from "./DeleteProduct";

const { Search } = Input;
const { Option } = Select;

interface ProductListProps {
  onSelectProduct: (productId: string, productName: string) => void;
}
const ProductListContainer = styled.div`
  padding: 20px;
`;

const ProductList: React.FC<ProductListProps> = ({ onSelectProduct }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { products, loading, error } = useSelector((state: RootState) => state.products);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  useEffect(() => {
    dispatch(fetchProducts({ filters: {}, page: 1 })); // Provide the required structure
  }, [dispatch]);
  

  const handleDeleteProduct = (product: any) => {
    setSelectedProduct(product);
    setDeleteModalVisible(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedProduct) {
      await dispatch(removeProduct(selectedProduct.id));
      setDeleteModalVisible(false);
      setSelectedProduct(null);
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const columns = [
    {
      title: getLocalizedText("Product Name", "productList"),
      dataIndex: "name",
      key: "name",
    },
    {
      title: getLocalizedText("Price", "productList"),
      dataIndex: "price",
      key: "price",
    },
    {
      title: getLocalizedText("Category", "productList"),
      dataIndex: "category",
      key: "category",
    },
    {
      title: getLocalizedText("Stock", "productList"),
      dataIndex: "stock",
      key: "stock",
    },
    {
      title: getLocalizedText("Actions", "productList"),
      key: "actions",
      render: (_: any, record: any) => (
        <>
          <Button type="link" onClick={() => onSelectProduct(record.id, record.name)}>
            {getLocalizedText("Edit", "productList")}
          </Button>
          <Button type="link" onClick={() => handleDeleteProduct(record)}>
            {getLocalizedText("Delete", "productList")}
          </Button>
        </>
      ),
    },
  ];

  return (
    <ProductListContainer>
      <h2>{getLocalizedText("Product List", "productList")}</h2>

      <div style={{ marginBottom: 20, display: "flex", gap: 10 }}>
        <Search
          placeholder={getLocalizedText("Search by product name", "productList")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: 300 }}
        />

        <Select
          defaultValue="all"
          value={categoryFilter}
          onChange={(value) => setCategoryFilter(value)}
          style={{ width: 200 }}
        >
          <Option value="all">{getLocalizedText("All Categories", "productList")}</Option>
          <Option value="B2B">{getLocalizedText("B2B", "productList")}</Option>
          <Option value="C2C">{getLocalizedText("C2C", "productList")}</Option>
          <Option value="B2C">{getLocalizedText("B2C", "productList")}</Option>
        </Select>
      </div>

      {loading && <Spin />}
      {error && <Alert message={error} type="error" />}

      <Table dataSource={filteredProducts} columns={columns} rowKey="id" pagination={{ pageSize: 10 }} />

      {deleteModalVisible && selectedProduct && (
        <DeleteProduct
          productId={selectedProduct.id}
          productName={selectedProduct.name}
          onClose={() => setDeleteModalVisible(false)}
        />
      )}
    </ProductListContainer>
  );
};

export default ProductList;
