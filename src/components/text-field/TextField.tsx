import React, { cloneElement, InputHTMLAttributes, useEffect, useState } from "react";
import { SpaceProps } from "styled-system";
import { colorOptions } from "../../interfaces";
import Box from "../Box";
import { SyledTextField, TextFieldWrapper } from "./TextFieldStyle";

export interface TextFieldProps {
  labelColor?: colorOptions;
  label?: string;
  errorText?: any;
  id?: any;
  fullwidth?: boolean;
  endAdornment?: any;
}

const TextField: React.FC<
  InputHTMLAttributes<HTMLInputElement> & TextFieldProps & SpaceProps
> = ({
  id,
  label,
  errorText,
  labelColor,
  endAdornment,
  color = "default",  // Set default value for color here
  fullwidth,
  ...props
}) => {
  const [textId, setTextId] = useState(id);

  // Extract spacing props
  let spacingProps: Record<string, any> = {}; // Explicitly typing spacingProps
  for (const key in props) {
    if (key.startsWith("m") || key.startsWith("p")) {
      spacingProps[key] = (props as Record<string, any>)[key]; // Cast props as Record<string, any>
    }
  }

  useEffect(() => {
    if (!id) setTextId(Math.random());
  }, [id]);  // Added 'id' to the dependency array

  return (
    <TextFieldWrapper
      color={labelColor && `${labelColor}.main`}
      style={fullwidth ? { width: "100%" } : undefined}  // Apply fullwidth conditionally
      {...spacingProps}
    >
      {label && <label htmlFor={textId}>{label}</label>}
      <Box position="relative">
        <SyledTextField id={textId} color={color} {...props} />
        {endAdornment &&
          cloneElement(endAdornment, {
            className: `end-adornment ${endAdornment.className}`,
          })}
      </Box>
      {errorText && <small>{errorText}</small>}
    </TextFieldWrapper>
  );
};

export default TextField;
