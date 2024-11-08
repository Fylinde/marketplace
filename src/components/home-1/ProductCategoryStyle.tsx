import styled from "styled-components";
import { getTheme } from "../../utils/utils";
import Box from "../Box";

type StyledProductCategoryProps = {
  onClick: any;
};

const StyledProductCategory = styled(Box)<StyledProductCategoryProps>`
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  cursor: pointer;
  min-width: 240px;
  border-radius: 5px;
  position: relative; /* Ensure child elements respect this parent */

  &:hover {
    box-shadow: ${getTheme("shadows.4")};
  }

  /* Ensure the image stays within the bounds of the container */
  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain; /* Keep aspect ratio and contain within the element */
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }

  .product-category-title {
    font-size: 17px;
    font-weight: 600;
    text-transform: capitalize;
    margin-left: 1.5rem;
  }

  .show-all {
    font-size: 16px;
    width: 100%;
    text-align: center;
  }
`;

export default StyledProductCategory;
