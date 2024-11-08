import systemCss from "@styled-system/css";
import { InputHTMLAttributes, useEffect, useState } from "react";
import styled from "styled-components";
import { color, ColorProps, compose, space, SpaceProps } from "styled-system";

// Allow props to be indexed dynamically
interface Props {
  [key: string]: any; // Allow any string keys on props
}

export interface RadioProps extends Props {
  color?: string;
  labelColor?: string;
  labelPlacement?: "start" | "end";
  label?: string | React.ReactChild;
  id?: any;
}

interface WrapperProps extends ColorProps, SpaceProps {
  labelPlacement?: "start" | "end";
}

// Styled component for the radio input
const SyledRadio = styled.input<
  InputHTMLAttributes<HTMLInputElement> & RadioProps
>(
  (props) =>
    systemCss({
      "-webkit-appearance": "none",
      "-moz-appearance": "none",
      appearance: "none",
      outline: "none",
      cursor: "pointer",
      margin: 0,
      width: 20,
      height: 20,
      borderRadius: 20,
      border: "2px solid",
      borderColor: "text.hint",
      position: "relative",

      "&:checked": {
        borderColor: `${props.color}.main`,
      },

      "&:after": {
        width: "calc(100% - 6px)",
        height: "calc(100% - 6px)",
        top: "50%",
        left: "50%",
        transform: "translateX(-50%) translateY(-50%)",
        borderRadius: "50%",
        position: "absolute",
        bg: "transparent",
        content: '" "',
        visibility: "visible",
        transition: "all 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
      },

      "&:checked:after": {
        bg: `${props.color}.main`,
      },

      "&:disabled": {
        borderColor: `text.disabled`,
      },

      "&:checked:disabled:after": {
        bg: `text.disabled`,
      },
    }),
  compose(color)
);

// Wrapper styled component for the radio label
const Wrapper = styled.div<WrapperProps>`
  display: flex;
  align-items: center;
  flex-direction: ${(props) =>
    props.labelPlacement !== "end" ? "row" : "row-reverse"};
  input {
    ${(props) =>
      props.labelPlacement !== "end"
        ? "margin-right: 0.5rem"
        : "margin-left: 0.5rem"};
  }
  label {
    cursor: pointer;
  }
  input[disabled] + label {
    color: text.disabled;
    cursor: unset;
  }

  ${color}
  ${space}
`;

// Main Radio component
const Radio: React.FC<
  InputHTMLAttributes<HTMLInputElement> & SpaceProps & RadioProps
> = ({ id, label, labelPlacement, labelColor, ...props }: RadioProps) => {
  const [radioId, setRadioId] = useState(id);

  // Extract spacing props dynamically
  let spacingProps: { [key: string]: any } = {};
  for (const key in props) {
    if (key.startsWith("m") || key.startsWith("p")) {
      spacingProps[key] = props[key];
    }
  }

  useEffect(() => {
    setRadioId(id || Math.random());
  }, []);

  return (
    <Wrapper
      labelPlacement={labelPlacement}
      color={`${labelColor}.main`}
      {...spacingProps} // Spread the extracted spacing props
    >
      <SyledRadio id={radioId} type="radio" {...props} />
      <label htmlFor={radioId}>{label}</label>
    </Wrapper>
  );
};

// Set default values for the radio component
Radio.defaultProps = {
  color: "secondary",
};

export default Radio;
