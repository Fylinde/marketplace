import React from "react";

interface TableProps {
  children: React.ReactNode;
  className?: string; // Optional CSS classes for custom styling
}

const Table: React.FC<TableProps> = ({ children, className }) => {
  return (
    <table className={`custom-table ${className || ""}`} style={styles.table}>
      {children}
    </table>
  );
};

const styles = {
  table: {
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "left",
    fontSize: "16px",
  } as React.CSSProperties,
};

export default Table;
