import React, { InputHTMLAttributes } from "react";
import ReactSelect, { Theme, StylesConfig } from "react-select";  // Ensure you install react-select and @types/react-select
import { SpaceProps } from "styled-system";
import { colors } from "../utils/themeColors";
import Box from "./Box";
import Typography from "./Typography";

type SelectOption = {
  label: any;
  value: any;
};

interface SelectProps
  extends InputHTMLAttributes<HTMLInputElement>,
    SpaceProps {
  options: SelectOption[];
  value?: any;
  defaultValue?: any;
  label?: string;
  errorText?: any;
}

const Select: React.FC<SelectProps> = ({
  options,
  id,
  label,
  errorText,
  ...props
}) => {
  // extract spacing props
  let spacingProps: Record<string, any> = {}; // Explicit type for dynamic keys
  let otherProps: Record<string, any> = {}; // Explicit type for other dynamic props
  
  // Cast props as Record<string, any> to handle dynamic indexing
  const castedProps = props as Record<string, any>;
  
  for (const key in castedProps) {
    if (key.startsWith("m") || key.startsWith("p")) {
      spacingProps[key] = castedProps[key];
    } else {
      otherProps[key] = castedProps[key];
    }
  }
  

  return (
    <Box {...spacingProps}>
      {label && (
        <Typography fontSize="0.875rem" mb="6px">
          {label}
        </Typography>
      )}
      <ReactSelect
        options={options}
        styles={customStyles}
        theme={(theme: Theme) => ({
          ...theme,
          colors: {
            ...theme.colors,
            primary50: colors.gray[100],
            primary: colors.primary.main,
            neutral20: colors.text.disabled,
          },
        })}
        {...otherProps}
      />
      {errorText && (
        <Typography color="error.main" ml="0.25rem" mt="0.25rem" as="small">
          {errorText}
        </Typography>
      )}
    </Box>
  );
};

// Custom styles for react-select
const customStyles: StylesConfig<SelectOption, false> = {
  input: (styles: any) => ({ ...styles, height: 30 }),
  option: (provided: any, state: any) => ({
    ...provided,
    color: "inherit",
    backgroundColor: state.isFocused ? "rgba(0,0,0, 0.015)" : "inherit",
    cursor: "pointer",
  }),
};

export default Select;
