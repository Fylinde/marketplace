import React, { useState } from "react";
import Box from "components/Box";
import Button from "components/buttons/Button";
import Modal from "@/components/modal/Modal";
import Table from "@/components/table/Table";
import Input from "@/components/input/Input";
import { validateBankDetails } from "services/validationService";



interface BankDetailsProps {
  data: { bankName: string; accountNumber: string; branchName: string; ifscCode: string; accountHolder: string }[];
  onAdd: (newBank: any) => void;
  onEdit: (index: number, updatedBank: any) => void;
  onDelete: (index: number) => void;
}

const BankDetails: React.FC<BankDetailsProps> = ({ data, onAdd, onEdit, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    bankName: "",
    accountNumber: "",
    branchName: "",
    ifscCode: "",
    accountHolder: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAdd = () => {
    if (validateBankDetails(formData)) {
      onAdd(formData);
      setFormData({
        bankName: "",
        accountNumber: "",
        branchName: "",
        ifscCode: "",
        accountHolder: "",
      });
      setIsModalOpen(false);
    } else {
      alert("Please provide valid bank details.");
    }
  };

  const handleEdit = () => {
    if (currentIndex !== null && validateBankDetails(formData)) {
      onEdit(currentIndex, formData);
      setIsModalOpen(false);
    } else {
      alert("Invalid data or no record selected.");
    }
  };

  const openModal = (index?: number) => {
    if (index !== undefined) {
      setIsEdit(true);
      setCurrentIndex(index);
      setFormData(data[index]);
    } else {
      setIsEdit(false);
      setFormData({
        bankName: "",
        accountNumber: "",
        branchName: "",
        ifscCode: "",
        accountHolder: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleDelete = (index: number) => {
    if (window.confirm("Are you sure you want to delete this bank detail?")) {
      onDelete(index);
    }
  };

  return (
    <Box mb="30px">
      <Table>
        <thead>
          <tr>
            <th>Bank Name</th>
            <th>Account Number</th>
            <th>Branch Name</th>
            <th>IFSC Code</th>
            <th>Account Holder</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((bank, index) => (
            <tr key={index}>
              <td>{bank.bankName}</td>
              <td>{bank.accountNumber}</td>
              <td>{bank.branchName}</td>
              <td>{bank.ifscCode}</td>
              <td>{bank.accountHolder}</td>
              <td>
                <Button onClick={() => openModal(index)}>Edit</Button>
                <Button onClick={() => handleDelete(index)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Button onClick={() => openModal()}>Add Bank</Button>

      {isModalOpen && ( //here
        <Modal title={isEdit ? "Edit Bank Details" : "Add Bank Details"} onClose={() => setIsModalOpen(false)}>
          <Box display="flex" flexDirection="column" gap="10px">
            <Input
              label="Bank Name"
              value={formData.bankName}
              onChange={(e) => handleInputChange("bankName", e.target.value)}
            />
            <Input
              label="Account Number"
              value={formData.accountNumber}
              onChange={(e) => handleInputChange("accountNumber", e.target.value)}
            />
            <Input
              label="Branch Name"
              value={formData.branchName}
              onChange={(e) => handleInputChange("branchName", e.target.value)}
            />
            <Input
              label="IFSC Code"
              value={formData.ifscCode}
              onChange={(e) => handleInputChange("ifscCode", e.target.value)}
            />
            <Input
              label="Account Holder Name"
              value={formData.accountHolder}
              onChange={(e) => handleInputChange("accountHolder", e.target.value)}
            />
            <Button onClick={isEdit ? handleEdit : handleAdd}>
              {isEdit ? "Update Bank Details" : "Add Bank"}
            </Button>
          </Box>
        </Modal>
      )}
    </Box>
  );
};

export default BankDetails;
