import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import AddProduct from "./AddProduct";
import BusinessRecommendations from "./BusinessRecommendations";
import DeleteProduct from "./DeleteProduct";
import EditProduct from "./EditProduct";
import InventoryManager from "./InventoryManager";
import PriceAndPromotion from "./PriceAndPromotion";
import ProductList from "./ProductList";
import { RootState, AppDispatch } from "../../../redux/store";
import { fetchProducts } from "../../../redux/slices/products/productSlice";

const ProductManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  // Redux Selectors for dynamic data
  const sellerId = useSelector((state: RootState) => state.sellers?.sellerId || "defaultSellerId");
  const buyerId = useSelector((state: RootState) => state.user?.profile?.buyerId || "defaultBuyerId");
  const region = useSelector((state: RootState) => state.market?.region || "defaultRegion");
  const season = useSelector((state: RootState) => state.market?.season || "defaultSeason");
  const targetAudience = useSelector((state: RootState) => state.market?.targetAudience || "defaultTargetAudience");
  const products = useSelector((state: RootState) => state.products?.products || []);


  // Fetch products dynamically
  useEffect(() => {
    dispatch(fetchProducts({ filters: {}, page: 1 })); // Provide the required structure
  }, [dispatch]);
  


  // State for managing product deletion
  const [selectedProduct, setSelectedProduct] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDeleteClose = () => {
    setShowDeleteModal(false);
  };

  const handleSelectProduct = (productId: string, productName: string) => {
    setSelectedProduct({ id: productId, name: productName });
    setShowDeleteModal(true);
  };

  return (
    <div>
      <h1>Product Management</h1>

      {/* Add Product */}
      <AddProduct />

      {/* Edit Product */}
      <EditProduct /> 

      {/* Product List */}
      <ProductList onSelectProduct={handleSelectProduct} /> {/* Pass `handleSelectProduct` */}

      {/* Delete Product */}
      {showDeleteModal && selectedProduct && (
        <DeleteProduct
          productId={selectedProduct.id}
          productName={selectedProduct.name}
          onClose={handleDeleteClose}
        />
      )}

      {/* Inventory Management */}
      <InventoryManager />

      {/* Price and Promotion Management */}
      <PriceAndPromotion />

      {/* Business Recommendations */}
      <BusinessRecommendations
        sellerId={sellerId}
        buyerId={buyerId}
        region={region}
        season={season}
        targetAudience={targetAudience}
      />
    </div>
  );
};

export default ProductManagement;
