import React from 'react';
import styled from 'styled-components';

interface DataInputProps {
  label: string;
  value: string | number;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
`;

const Label = styled.label`
  margin-bottom: 5px;
  font-weight: bold;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 5px;
  font-size: 1rem;
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const DataInput: React.FC<DataInputProps> = ({ label, value, onChange, type = 'text' }) => (
  <Container>
    <Label>{label}</Label>
    <Input type={type} value={value} onChange={onChange} />
  </Container>
);

export default DataInput;
