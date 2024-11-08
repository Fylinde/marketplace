import { TextareaHTMLAttributes } from "react";
import { BorderProps, SpaceProps } from "styled-system";
import { colorOptions } from "../../interfaces";
import { SyledTextArea, TextAreaWrapper } from "./TextAreaStyle";

export interface TextAreaProps
  extends SpaceProps,
    BorderProps,
    TextareaHTMLAttributes<HTMLTextAreaElement> {
  labelColor?: colorOptions;
  label?: string;
  errorText?: any;
  id?: any;
  fullwidth?: boolean;
}

const TextArea: React.FC<TextAreaProps> = ({
  id,
  label,
  errorText,
  labelColor,
  ...props
}: TextAreaProps) => {
  // extract spacing props
  let spacingProps: Record<string, any> = {}; // Explicitly typing as Record<string, any>
  let otherProps: Record<string, any> = {}; // Explicitly typing as Record<string, any>

  for (const key in props) {
    if (key.startsWith("m") || key.startsWith("p")) {
      spacingProps[key] = (props as Record<string, any>)[key]; // Safely cast props
    } else {
      otherProps[key] = (props as Record<string, any>)[key]; // Safely cast props
    }
  }

  return (
    <TextAreaWrapper
      color={labelColor && `${labelColor}.main`}
      fullwidth={props.fullwidth}
      {...spacingProps}
    >
      {label && <label htmlFor={id}>{label}</label>}
      <SyledTextArea id={id} {...otherProps} />
      {errorText && <small>{errorText}</small>}
    </TextAreaWrapper>
  );
};

TextArea.defaultProps = {
  id: "textArea",
  color: "default",
};

export default TextArea;
