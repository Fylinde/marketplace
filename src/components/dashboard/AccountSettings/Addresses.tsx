import React, { useState } from "react";
import Box from "components/Box";
import Button from "components/buttons/Button";
import Modal from "components/modal/Modal";
import Input from "components/input/Input";
import Table from "components/table/Table";
import { validateFields, validateString, validateNumeric } from "services/validationService";

// Define the type for Address
interface Address {
  id: string;
  name: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

// Define the Props type for the component
interface AddressesProps {
  data: Address[];
  onUpdate: (updatedData: Address[]) => void;
}

const Addresses: React.FC<AddressesProps> = ({ data, onUpdate }) => {
  const [addresses, setAddresses] = useState<Address[]>(data);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentAddressId, setCurrentAddressId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Address>({
    id: "",
    name: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    isDefault: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: keyof Address, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateAddress = (): boolean => {
    const { isValid, errors: validationErrors } = validateFields({
      name: { value: formData.name, validate: (value) => validateString(value, "Name", 3) },
      street: { value: formData.street, validate: (value) => validateString(value, "Street", 5) },
      city: { value: formData.city, validate: (value) => validateString(value, "City", 3) },
      state: { value: formData.state, validate: (value) => validateString(value, "State", 2) },
      zipCode: { value: formData.zipCode, validate: (value) => validateNumeric(value, "ZIP Code", 5, 10) },
      country: { value: formData.country, validate: (value) => validateString(value, "Country", 3) },
    });

    setErrors(validationErrors);
    return isValid;
  };

  const handleAddAddress = () => {
    if (!validateAddress()) return;

    const newAddress = {
      ...formData,
      id: Date.now().toString(),
      isDefault: addresses.length === 0, // First address is default
    };

    const updatedAddresses = [...addresses, newAddress];
    setAddresses(updatedAddresses);
    onUpdate(updatedAddresses);
    setFormData({ id: "", name: "", street: "", city: "", state: "", zipCode: "", country: "", isDefault: false });
    setIsModalOpen(false);
  };

  const handleEditAddress = () => {
    if (!validateAddress()) return;

    const updatedAddresses = addresses.map((address) =>
      address.id === currentAddressId ? { ...address, ...formData } : address
    );

    setAddresses(updatedAddresses);
    onUpdate(updatedAddresses);
    setIsModalOpen(false);
  };

  const handleDeleteAddress = (id: string) => {
    const address = addresses.find((address) => address.id === id);

    if (address?.isDefault) {
      alert("Cannot delete the default address. Please set another address as default first.");
      return;
    }

    if (window.confirm("Are you sure you want to delete this address?")) {
      const updatedAddresses = addresses.filter((address) => address.id !== id);
      setAddresses(updatedAddresses);
      onUpdate(updatedAddresses);
    }
  };

  const handleSetDefaultAddress = (id: string) => {
    const updatedAddresses = addresses.map((address) =>
      address.id === id
        ? { ...address, isDefault: true }
        : { ...address, isDefault: false }
    );

    setAddresses(updatedAddresses);
    onUpdate(updatedAddresses);
  };

  const openModal = (id?: string) => {
    setIsEdit(!!id);
    setCurrentAddressId(id || null);

    if (id) {
      const address = addresses.find((addr) => addr.id === id);
      if (address) setFormData(address);
    } else {
      setFormData({ id: "", name: "", street: "", city: "", state: "", zipCode: "", country: "", isDefault: false });
    }

    setIsModalOpen(true);
  };

  return (
    <Box>
      <Table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Street</th>
            <th>City</th>
            <th>State</th>
            <th>ZIP Code</th>
            <th>Country</th>
            <th>Default</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {addresses.map((address) => (
            <tr key={address.id}>
              <td>{address.name}</td>
              <td>{address.street}</td>
              <td>{address.city}</td>
              <td>{address.state}</td>
              <td>{address.zipCode}</td>
              <td>{address.country}</td>
              <td>{address.isDefault ? "Yes" : "No"}</td>
              <td>
                <Button onClick={() => openModal(address.id)}>Edit</Button>
                <Button
                  onClick={() => handleDeleteAddress(address.id)}
                  disabled={address.isDefault}
                >
                  Delete
                </Button>
                {!address.isDefault && (
                  <Button onClick={() => handleSetDefaultAddress(address.id)}>
                    Set Default
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Button onClick={() => openModal()}>Add Address</Button>

      {isModalOpen && (
        <Modal
          title={isEdit ? "Edit Address" : "Add Address"}
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        >
          <Box display="flex" flexDirection="column" style={{ gap: "10px" }}>
            <Input
              label="Name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              error={errors.name}
            />
            <Input
              label="Street"
              value={formData.street}
              onChange={(e) => handleInputChange("street", e.target.value)}
              error={errors.street}
            />
            <Input
              label="City"
              value={formData.city}
              onChange={(e) => handleInputChange("city", e.target.value)}
              error={errors.city}
            />
            <Input
              label="State"
              value={formData.state}
              onChange={(e) => handleInputChange("state", e.target.value)}
              error={errors.state}
            />
            <Input
              label="ZIP Code"
              value={formData.zipCode}
              onChange={(e) => handleInputChange("zipCode", e.target.value)}
              error={errors.zipCode}
            />
            <Input
              label="Country"
              value={formData.country}
              onChange={(e) => handleInputChange("country", e.target.value)}
              error={errors.country}
            />
            <Button onClick={isEdit ? handleEditAddress : handleAddAddress}>
              {isEdit ? "Update Address" : "Add Address"}
            </Button>
          </Box>
        </Modal>
      )}
    </Box>
  );
};

export default Addresses;
