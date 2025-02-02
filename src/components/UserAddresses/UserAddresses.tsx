import React, { useEffect, useState } from 'react';
import { getUserAddresses, addUserAddress, deleteUserAddress, setDefaultAddress } from '../../services/addressService';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';  // Adjust this import based on your store setup
import './UserAddresses.css';  // Optional: create a CSS file for styling

const UserAddresses: React.FC = () => {
  const dispatch = useDispatch();
  const [addresses, setAddresses] = useState<any[]>([]);
  const [newAddress, setNewAddress] = useState({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    phoneNumber: '',  // Add phoneNumber here
  });

  // Get the userId from the Redux store
  const userId = useSelector((state: RootState) => state.auth.user?.id);  // Assuming user ID is stored in auth slice

  // Fetch user addresses on component mount
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
  }, [userId]);  // Re-run effect if userId changes

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewAddress({
      ...newAddress,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const addedAddress = await addUserAddress(newAddress);
      setAddresses([...addresses, addedAddress]);
      setNewAddress({
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
        phoneNumber: '',  // Add phoneNumber here   // Make phoneNumber optional
      });
    } catch (error) {
      console.error("Error adding address:", error);
    }
  };

  return (
    <div className="address-container">
      <h2>Your Addresses</h2>
      <ul>
        {addresses.map((address) => (
          <li key={address.id}>
            {address.street}, {address.city}, {address.state}, {address.postalCode}, {address.country}
          </li>
        ))}
      </ul>

      <h3>Add New Address</h3>
      <form onSubmit={handleAddAddress}>
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
          name="postalCode"
          placeholder="Postal Code"
          value={newAddress.postalCode}
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
          name="phoneNumber"
          placeholder="Phone Number"
          value={newAddress.phoneNumber}
          onChange={handleInputChange}
          required
        />

        <button type="submit">Add Address</button>
      </form>
    </div>
  );
};

export default UserAddresses;
