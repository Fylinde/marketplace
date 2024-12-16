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
  nextLabel?: string; // Custom label for next button
  previousLabel?: string; // Custom label for previous button
  firstLabel?: string; // Custom label for first button
  lastLabel?: string; // Custom label for last button
}

const Pagination: React.FC<PaginationProps> = ({
  pageCount,
  marginPagesDisplayed = 2,
  pageRangeDisplayed = 5,
  onChange,
  forcePage,
  nextLabel = "Next",
  previousLabel = "Previous",
  firstLabel = "First",
  lastLabel = "Last",
  ...props
}) => {
  // Handle page changes
  const handlePageChange = (page: { selected: number }) => {
    if (onChange) onChange({ selected: page.selected });
  };

  // Handle no pages case
  if (pageCount <= 1) return null;

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
            aria-label={previousLabel}
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
            aria-label={nextLabel}
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
        forcePage={forcePage}
        containerClassName="pagination-container"
        pageClassName="pagination-page"
        pageLinkClassName="pagination-link"
        previousClassName="pagination-previous"
        nextClassName="pagination-next"
        breakClassName="pagination-break"
        activeClassName="active"
        disabledClassName="disabled"
        renderOnZeroPageCount={null}
      />

      {/* First and Last Page Buttons */}
      <div className="additional-controls">
        <Button
          className="first-page-button"
          color="secondary"
          variant="text"
          onClick={() => handlePageChange({ selected: 0 })}
          disabled={forcePage === 0}
          aria-label={firstLabel}
        >
          {firstLabel}
        </Button>
        <Button
          className="last-page-button"
          color="secondary"
          variant="text"
          onClick={() => handlePageChange({ selected: pageCount - 1 })}
          disabled={forcePage === pageCount - 1}
          aria-label={lastLabel}
        >
          {lastLabel}
        </Button>
      </div>
    </StyledPagination>
  );
};

export default Pagination;
