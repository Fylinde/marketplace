import React, { useEffect, useRef, useState } from "react";
import CategoryDropdown from "./CategoryDropdown";
import { StyledCategory } from "./CategoryStyle";

export interface CategoriesProps {
  open?: boolean; // open prop might be passed as optional
  children: React.ReactElement;
}

const Categories: React.FC<CategoriesProps> = ({ open: isOpen = false, children }) => { // Ensure 'open' is either passed or defaults to 'false'
  const [open, setOpen] = useState<boolean>(isOpen); // Set 'open' as a boolean
  const popoverRef = useRef(open);
  popoverRef.current = open;

  // Explicitly define the event type as MouseEvent for the toggleMenu function
  const toggleMenu = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    if (!isOpen) setOpen(!open);
  };

  const handleDocumentClick = () => {
    if (popoverRef.current && !isOpen) setOpen(false);
  };

  useEffect(() => {
    window.addEventListener("click", handleDocumentClick);
    return () => {
      window.removeEventListener("click", handleDocumentClick);
    };
  }, []);

  return (
    <StyledCategory open={open}> {/* 'open' is guaranteed to be a boolean */}
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
