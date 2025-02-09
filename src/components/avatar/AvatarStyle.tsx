import styled from "styled-components";
import {
  border,
  BorderProps,
  color,
  ColorProps,
  layout,
  space,
  SpaceProps,
} from "styled-system";
// import { themeGet } from "@styled-system/theme-get";
import { AvatarProps } from "./Avatar";

const StyledAvatar = styled.div<
  AvatarProps & BorderProps & ColorProps & SpaceProps
>`
  display: block;
  position: relative;
  text-align: center;
  font-weight: 600;
  font-size: ${(props) => (props.size ? props.size / 2 : 25)}px;  // Optional chaining or fallback
  border-radius: ${(props) => (props.size || 50)}px;
  min-width: ${(props) => (props.size || 50)}px;
  overflow: hidden;

  img {
    display: block;
    height: 100%;
    width: 100%;
  }
  & > * {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    line-height: 0;
  }
  ${color}
  ${space}
  ${border}
  ${layout}
`;


export default StyledAvatar;
