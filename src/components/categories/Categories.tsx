import React, { useEffect, useRef, useState, useCallback } from "react";
import CategoryDropdown from "./CategoryDropdown";
import { StyledCategory } from "./CategoryStyle";

export interface CategoriesProps {
  open?: boolean; // open prop might be passed as optional
  children: React.ReactElement;
}

const Categories: React.FC<CategoriesProps> = ({ open: isOpen = false, children }) => {
  const [open, setOpen] = useState<boolean>(isOpen); // Set 'open' as a boolean
  const popoverRef = useRef(open);
  popoverRef.current = open;

  const toggleMenu = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    if (!isOpen) setOpen(!open);
  };

  // Use useCallback to ensure the function is stable and doesn't change on every render
  const handleDocumentClick = useCallback(() => {
    if (popoverRef.current && !isOpen) setOpen(false);
  }, [isOpen]);

  useEffect(() => {
    window.addEventListener("click", handleDocumentClick);
    return () => {
      window.removeEventListener("click", handleDocumentClick);
    };
  }, [handleDocumentClick]); // Add handleDocumentClick as a dependency

  return (
    <StyledCategory open={open}>
      {React.cloneElement(children, {
        open,
        className: `${children.props.className} cursor-pointer`,
        onClick: toggleMenu,
      })}
      <CategoryDropdown open={open} />
    </StyledCategory>
  );
};

export default Categories;
