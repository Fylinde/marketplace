import React, { cloneElement } from "react";
import { createPortal } from "react-dom";
import FlexBox from "../FlexBox";
import StyledModal from "./ModalStyle";

export interface ModalProps {
  open?: boolean; // Whether the modal is open
  title?: string; // Title of the modal
  children?: React.ReactNode; // Modal content
  onClose?: () => void; // Function to close the modal
}

const Modal: React.FC<ModalProps> = ({ children, title, open, onClose }) => {
  // Stop clicks inside the modal from closing it
  const handleModalContentClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
  };

  // Handle backdrop click
  const handleBackdropClick = () => {
    if (onClose) onClose();
  };

  if (window.document && open) {
    let modalRoot = document.querySelector("#modal-root");

    // Create a modal root if it doesn't exist
    if (!modalRoot) {
      modalRoot = document.createElement("div");
      modalRoot.setAttribute("id", "modal-root");
      document.body.appendChild(modalRoot);
    }

    return createPortal(
      <StyledModal
        role="dialog"
        aria-labelledby={title ? "modal-title" : undefined}
        flexDirection="column"
        alignItems="center"
        onClick={handleBackdropClick}
      >
        <div
          className="modal-container"
          style={{
            background: "white",
            borderRadius: "8px",
            maxWidth: "500px",
            width: "100%",
            padding: "20px",
          }}
          onClick={handleModalContentClick}
        >
          {/* Render the title if provided */}
          {title && (
            <div
              id="modal-title"
              style={{
                fontSize: "18px",
                fontWeight: "bold",
                marginBottom: "10px",
                textAlign: "center",
              }}
            >
              {title}
            </div>
          )}

          {/* Render modal content */}
          <FlexBox justifyContent="center">{children}</FlexBox>

          {/* Close button (optional) */}
          {onClose && (
            <button
              onClick={onClose}
              style={{
                marginTop: "15px",
                display: "block",
                marginLeft: "auto",
                marginRight: "auto",
                background: "#007BFF",
                color: "white",
                border: "none",
                padding: "10px 15px",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Close
            </button>
          )}
        </div>
      </StyledModal>,
      modalRoot
    );
  } else {
    return null;
  }
};

Modal.defaultProps = {
  open: false,
};

export default Modal;
