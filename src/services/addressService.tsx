import axios from 'axios';
import { Address } from '../models/Address';

const API_URL = process.env.REACT_APP_ADDRESS_SERVICE_URL || 'http://localhost:8007/addresses';


// Define the AddressData type
interface AddressData {
  street: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone_number: string;
}

// Function for adding a new user address
export const addUserAddress = async (addressData: AddressData) => {
  const token = localStorage.getItem('access_token');
  if (!token) throw new Error('No token available');

  console.log('Token being used:', token);

  const headers = { Authorization: `Bearer ${token}` };
  const response = await axios.post(API_URL, addressData, { headers });

  return response.data;
};

// Function for fetching all addresses of a user
export const getUserAddresses = async (userId: number) => {
  const token = localStorage.getItem('access_token');
  if (!token) throw new Error('No token available');

  try {
    const response = await axios.get(`${API_URL}/users/${userId}/addresses`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching addresses:', error);
    throw error;
  }
};

// Function for deleting a user address
export const deleteUserAddress = async (addressId: number) => {
  const token = localStorage.getItem('access_token');
  if (!token) throw new Error('No token available');

  if (!window.confirm("Are you sure you want to delete this address?")) {
    console.log("Address deletion cancelled by user");
    return;
  }

  try {
    const response = await axios.get(`${API_URL}/${addressId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const addressData = response.data;

    if (addressData.is_primary) {
      alert("You cannot delete the default address. Please set another address as default before deleting.");
      return;
    }

    await axios.delete(`${API_URL}/${addressId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(`Address ${addressId} deleted successfully.`);
  } catch (error) {
    console.error('Error deleting address:', error);
    throw error;
  }
};

// Function for updating a user address
export const updateUserAddress = async (addressId: number, addressData: AddressData) => {
  const token = localStorage.getItem('access_token');
  if (!token) throw new Error('No token available');

  try {
    const response = await axios.put(`${API_URL}/${addressId}`, addressData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(`Address ${addressId} updated successfully.`);
    return response.data;
  } catch (error) {
    console.error('Error updating address:', error);
    throw error;
  }
};

// Function for setting a default address
export const setDefaultAddress = async (addressId: number) => {
  const token = localStorage.getItem('access_token');
  if (!token) throw new Error('No token available');

  try {
    await axios.post(`${API_URL}/${addressId}/set-default`, null, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(`Address ${addressId} set as default successfully.`);
  } catch (error) {
    console.error('Error setting default address:', error);
    throw error;
  }
};
