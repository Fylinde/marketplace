import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string; // Make label optional
  value: string | number; // Accept both string and number types
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
  error?: string; // Optional error message
  className?: string; // Optional CSS classes for styling
  disabled?: boolean; // Add disabled prop
}

const Input: React.FC<InputProps> = ({
  label,
  value,
  onChange,
  type = "text",
  placeholder = "",
  error = "",
  className = "",
  disabled = false,
  ...rest
}) => {
  return (
    <div className={`input-container ${className}`} style={styles.container}>
      {label && <label style={styles.label}>{label}</label>} {/* Conditionally render */}
      <input
        type={type}
        value={value} // This will now work for both string and number
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled} // Apply the disabled prop
        style={{
          ...styles.input,
          ...(error ? styles.errorInput : {}),
          ...(disabled ? styles.disabledInput : {}),
        }}
        {...rest} // Spread additional props (e.g., `readOnly`, `maxLength`)
      />
      {error && <span style={styles.errorText}>{error}</span>}
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    marginBottom: "10px",
  } as React.CSSProperties,
  label: {
    fontWeight: "bold",
    marginBottom: "5px",
  } as React.CSSProperties,
  input: {
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    fontSize: "14px",
  } as React.CSSProperties,
  errorInput: {
    borderColor: "red",
  } as React.CSSProperties,
  disabledInput: {
    backgroundColor: "#f5f5f5",
    cursor: "not-allowed",
  } as React.CSSProperties,
  errorText: {
    color: "red",
    fontSize: "12px",
    marginTop: "5px",
  } as React.CSSProperties,
};

export default Input;
