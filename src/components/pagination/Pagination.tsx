import React from "react";
import ReactPaginate from "react-paginate";
import { SpaceProps } from "styled-system";
import Button from "../buttons/Button";
import Icon from "../icon/Icon";
import { StyledPagination } from "./PaginationStyle";

export interface PaginationProps extends SpaceProps {
  pageCount: number; // Total number of pages
  marginPagesDisplayed?: number; // Number of margin pages to display
  pageRangeDisplayed?: number; // Number of pages to display in the range
  onChange?: (data: { selected: number }) => void; // Callback for page changes
  forcePage?: number; // Current page index to forcefully display
}


const Pagination: React.FC<PaginationProps> = ({
  pageCount,
  marginPagesDisplayed = 2, // Default to 2 margin pages
  pageRangeDisplayed = 5, // Default to 5 pages in range
  onChange,
  ...props
}) => {
  // Handle page changes and forward to the onChange prop
  const handlePageChange = (page: { selected: number }) => {
    if (onChange) onChange({ selected: page.selected });
  };

  return (
    <StyledPagination {...props}>
      <ReactPaginate
  previousLabel={
    <Button
      className="control-button"
      color="primary"
      overflow="hidden"
      height="auto"
      padding="6px"
      borderRadius="50%"
    >
      <Icon defaultcolor="currentColor" variant="small">
        chevron-left
      </Icon>
    </Button>
  }
  nextLabel={
    <Button
      className="control-button"
      color="primary"
      overflow="hidden"
      height="auto"
      padding="6px"
      borderRadius="50%"
    >
      <Icon defaultcolor="currentColor" variant="small">
        chevron-right
      </Icon>
    </Button>
  }
  breakLabel={
    <Icon defaultcolor="currentColor" variant="small">
      triple-dot
    </Icon>
  }
  pageCount={pageCount}
  marginPagesDisplayed={marginPagesDisplayed}
  pageRangeDisplayed={pageRangeDisplayed}
  onPageChange={handlePageChange}
  forcePage={forcePage} // Pass forcePage here
  containerClassName="pagination-container"
  pageClassName="pagination-page"
  pageLinkClassName="pagination-link"
  previousClassName="pagination-previous"
  nextClassName="pagination-next"
  breakClassName="pagination-break"
  activeClassName="active"
  disabledClassName="disabled"
/>

    </StyledPagination>
  );
};

export default Pagination;
