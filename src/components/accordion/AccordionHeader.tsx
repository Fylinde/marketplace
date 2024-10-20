import React from "react";
import styled from "styled-components";
import { FlexboxProps, SpaceProps } from "styled-system";
import Box from "../Box";
import Icon from "../icon/Icon";
import { AccordionHeaderWrapper } from "./AccordionStyle";

export const StyledAccordionHeader = styled(Box)``;

type AccordionHeaderProps = {
  showIcon?: boolean;
  open?: boolean;
  children?: React.ReactNode; // Explicitly typed as ReactNode
  [key: string]: unknown;
};

const AccordionHeader: React.FC<
  SpaceProps & FlexboxProps & AccordionHeaderProps
> = ({ children, showIcon = true, open = false, ...props }) => {
  return (
    <AccordionHeaderWrapper
      alignItems="center"
      justifyContent="space-between"
      open={open} // Ensure `open` is always a boolean
      {...props}
    >
      {children} {/* Ensure that children are typed as ReactNode */}
      {showIcon && (
        <Icon
          className="caret-icon"
          variant="small"
          defaultcolor="currentColor"
        >
          chevron-right
        </Icon>
      )}
    </AccordionHeaderWrapper>
  );
};

// Set default props to prevent undefined values
AccordionHeader.defaultProps = {
  showIcon: true,
  open: false, // Ensure `open` defaults to `false`
  py: "0.5rem",
  px: "1rem",
};

export default AccordionHeader;
