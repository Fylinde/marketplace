import React, { useEffect, useState } from 'react';
import { getUserAddresses, addUserAddress, deleteUserAddress, setDefaultAddress } from '../services/addressService';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';  // Adjust this import based on your store setup
import './AddressManagement.css';

const AddressManagement: React.FC = () => {
  const [addresses, setAddresses] = useState<any[]>([]);
  const [newAddress, setNewAddress] = useState({
    street: '',
    city: '',
    state: '',
    postal_code: '',
    country: '',
    phone_number: '',  // Add phone_number here
  });

  // Get the userId from the Redux store
  const userId = useSelector((state: RootState) => state.auth.user?.id);

  
  // Fetch addresses when the component is mounted
  useEffect(() => {
    const fetchAddresses = async () => {
      if (userId) {
        try {
          const fetchedAddresses = await getUserAddresses(userId);  // Pass userId as argument
          setAddresses(fetchedAddresses);
        } catch (error) {
          console.error("Error fetching addresses:", error);
        }
      }
    };
    fetchAddresses();
  }, [userId]);  // Re-run the effect if userId changes

  // Handle input change for adding a new address
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewAddress({
      ...newAddress,
      [e.target.name]: e.target.value,
    });
  };

  // Handle adding a new address
  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const addedAddress = await addUserAddress(newAddress);
      setAddresses([...addresses, addedAddress]);
      setNewAddress({
        street: '',
        city: '',
        state: '',
        postal_code: '',
        country: '',
        phone_number: '',  // Add phone_number here
      });
    } catch (error) {
      console.error("Error adding address:", error);
    }
  };

  // Handle deleting an address
  const handleDeleteAddress = async (id: number) => {
    try {
      await deleteUserAddress(id);
      setAddresses(addresses.filter((address) => address.id !== id));
    } catch (error) {
      console.error("Error deleting address:", error);
    }
  };

  // Handle setting an address as default
  const handleSetDefaultAddress = async (id: number) => {
    try {
      await setDefaultAddress(id);
      const updatedAddresses = addresses.map((address) =>
        address.id === id ? { ...address, is_default: true } : { ...address, is_default: false }
      );
      setAddresses(updatedAddresses);
    } catch (error) {
      console.error("Error setting default address:", error);
    }
  };

  return (
    <div className="address-management">
      <h1>Your Addresses</h1>
      <ul>
        {addresses.map((address) => (
          <li key={address.id}>
            {address.street}, {address.city}, {address.state}, {address.postal_code}, {address.country}
            {address.is_default && <span> (Default)</span>}
            <button onClick={() => handleDeleteAddress(address.id)}>Delete</button>
            {!address.is_default && <button onClick={() => handleSetDefaultAddress(address.id)}>Set as Default</button>}
          </li>
        ))}
      </ul>

      <form onSubmit={handleAddAddress}>
        <h4>Add New Address</h4>
        <input
          type="text"
          name="street"
          placeholder="Street"
          value={newAddress.street}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="city"
          placeholder="City"
          value={newAddress.city}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="state"
          placeholder="State"
          value={newAddress.state}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="postal_code"
          placeholder="Postal Code"
          value={newAddress.postal_code}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="country"
          placeholder="Country"
          value={newAddress.country}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="phone_number"
          placeholder="Phone Number"
          value={newAddress.phone_number}
          onChange={handleInputChange}
          required
        />

        <button type="submit">Add Address</button>
      </form>
    </div>
  );
};

export default AddressManagement;
