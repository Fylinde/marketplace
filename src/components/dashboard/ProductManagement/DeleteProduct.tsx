import React, { useState } from "react";
import styled from "styled-components";
import Button from "components/buttons/Button";
import Modal from "../../../components/modal/Modal";
import { useDispatch } from "react-redux";
import { deleteProduct } from "services/productService";
import { AppDispatch } from "redux/store";
import { getLocalizedText } from "utils/localizationUtils";
import { useNavigate } from 'react-router-dom';


// Styled Components
const StyledWrapper = styled.div`
  .modal-header {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 1rem;
  }

  .modal-body {
    font-size: 1rem;
    margin-bottom: 1.5rem;
  }

  .modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
  }
`;

interface DeleteProductProps {
  productId: string;
  productName: string;
  onClose: () => void;
}

const DeleteProduct: React.FC<DeleteProductProps> = ({ productId, productName, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteProduct(productId);
      alert(getLocalizedText("deleteProduct.successMessage", "product", { name: productName }));
      navigate("/vendor/products");
      onClose();
    } catch (error) {
      console.error("Error deleting product:", error);
      alert(getLocalizedText("deleteProduct.errorMessage", "product"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledWrapper>
      <Modal onClose={onClose}>
        <div className="modal-header">
          {getLocalizedText("deleteProduct.title", "product")}
        </div>
        <div className="modal-body">
          {getLocalizedText("deleteProduct.confirmationMessage", "product", { name: productName })}
        </div>
        <div className="modal-actions">
          <Button
            variant="outlined"
            color="secondary"
            onClick={onClose}
            disabled={loading}
          >
            {getLocalizedText("deleteProduct.cancelButton", "product")}
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading
              ? getLocalizedText("deleteProduct.deleting", "product")
              : getLocalizedText("deleteProduct.deleteButton", "product")}
          </Button>
        </div>
      </Modal>
    </StyledWrapper>
  );
};

export default DeleteProduct;
