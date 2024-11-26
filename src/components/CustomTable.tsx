import React from 'react';
import styled from 'styled-components';

interface CustomTableProps<T> {
  data: T[];
  columns: Array<{
    title: string;
    key: string;
    render?: (item: T) => React.ReactNode;
  }>;
}

const TableContainer = styled.div`
  width: 100%;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 5px;
  overflow: hidden;
`;

const TableHeader = styled.div`
  display: flex;
  background-color: ${({ theme }) => theme.colors.tableHeader};
  padding: 10px;
  font-weight: bold;
`;

const TableRow = styled.div`
  display: flex;
  &:nth-child(even) {
    background-color: ${({ theme }) => theme.colors.tableRowEven};
  }
`;

const TableCell = styled.div`
  flex: 1;
  padding: 10px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const CustomTable = <T,>({ data, columns }: CustomTableProps<T>) => (
  <TableContainer>
    <TableHeader>
      {columns.map((col) => (
        <TableCell key={col.key}>{col.title}</TableCell>
      ))}
    </TableHeader>
    {data.map((item, idx) => (
      <TableRow key={idx}>
        {columns.map((col) => (
          <TableCell key={col.key}>{col.render ? col.render(item) : (item as any)[col.key]}</TableCell>
        ))}
      </TableRow>
    ))}
  </TableContainer>
);

export default CustomTable;
