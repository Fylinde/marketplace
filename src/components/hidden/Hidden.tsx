import React from "react";
import styled from "styled-components";
import { compose, flex, space, SpaceProps } from "styled-system";
import { deviceOptions } from "../../interfaces";
import { deviceSize } from "../../utils/constants";

export interface HiddenProps {
  down?: number | deviceOptions;
  up?: number | deviceOptions;
  [key: string]: unknown;
}

const StyledHidden = styled.div<HiddenProps & SpaceProps>(({ up, down }) => {
  // Add type guards to ensure up and down are valid before using them
  const upDeviceSize = up && typeof up === "string" ? deviceSize[up] : up;
  const downDeviceSize = down && typeof down === "string" ? deviceSize[down] : down;

  if (up)
    return {
      [`@media only screen and (min-width: ${upDeviceSize! + 1}px)`]: {
        display: "none",
      },
    };
  else if (down)
    return {
      [`@media only screen and (max-width: ${downDeviceSize!}px)`]: {
        display: "none",
      },
    };
  else
    return {
      display: "none",
    };
}, compose(space, flex));

const Hidden: React.FC<HiddenProps & SpaceProps> = ({ children, ...props }) => {
  return <StyledHidden {...props}>{children}</StyledHidden>;
};

export default Hidden;
