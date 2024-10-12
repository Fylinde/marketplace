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
  const token = localStorage.getItem('token');  // Retrieve the token from localStorage

  if (!token) {
    throw new Error('No token available');
  }

  console.log('Token being used:', token);

  const response = await axios.post(`${API_URL}/addresses`, addressData, {
    headers: {
      Authorization: `Bearer ${token}`,  // Pass the JWT token in the Authorization header
    },
  });

  return response.data;
};

// Function for fetching all addresses of a user
export const getUserAddresses = async (userId: number) => {
  try {
    const token = localStorage.getItem('token');  // Get the token from localStorage
     
    if (!token) {
      throw new Error('No token available');
  }
    // Corrected API endpoint to match the backend route
    const response = await axios.get(`${API_URL}/users/${userId}/addresses`, {
      headers: {
        Authorization: `Bearer ${token}`,  // Pass the JWT token in the Authorization header
      },
    });

    return response.data;  // Return the response data containing the addresses
  } catch (error) {
    console.error('Error fetching addresses:', error);
    throw error;  // Re-throw the error for further handling in the calling code
  }
};

// Updated function for deleting a user address
export const deleteUserAddress = async (addressId: number) => {
  try {
    const token = localStorage.getItem('token');  // Get the token from localStorage
    
    // Trigger the confirmation popup here
    const isConfirmed = window.confirm("Are you sure you want to delete this address?");
    if (!isConfirmed) {
      console.log("Address deletion cancelled by user");
      return;  // Stop the deletion process
    }

    // Call the backend to check if it's a default address before deleting
    const response = await axios.get(`${API_URL}/addresses/${addressId}`, {
      headers: {
        Authorization: `Bearer ${token}`,  // Pass the JWT token in the Authorization header
      },
    });
    const addressData = response.data;
    
    // If the address is default, show a warning popup
    if (addressData.is_primary) {
      alert("You cannot delete the default address. Please set another address as default before deleting.");
      return;
    }

    // Proceed with deletion if it's not the default address
    await axios.delete(`${API_URL}/addresses/${addressId}`, {
      headers: {
        Authorization: `Bearer ${token}`,  // Pass the JWT token in the Authorization header
      },
    });
    console.log(`Address ${addressId} deleted successfully.`);
  } catch (error) {
    console.error('Error deleting address:', error);
    throw error;
  }
};


// Updated function for updating a user address
export const updateUserAddress = async (addressId: number, addressData: AddressData) => {
  try {
    const token = localStorage.getItem('token');  // Get the token from localStorage

    const response = await axios.put(`${API_URL}/addresses/${addressId}`, addressData, {
      headers: {
        Authorization: `Bearer ${token}`,  // Pass the JWT token in the Authorization header
      },
    });

    console.log(`Address ${addressId} updated successfully.`);
    return response.data;
  } catch (error) {
    console.error('Error updating address:', error);
    throw error;
  }
};

// Updated function for setting a default address
export const setDefaultAddress = async (addressId: number) => {
  try {
    const token = localStorage.getItem('token');  // Get the token from localStorage

    await axios.post(`${API_URL}/addresses/${addressId}/set-default`, null, {
      headers: {
        Authorization: `Bearer ${token}`,  // Pass the JWT token in the Authorization header
      },
    });
    console.log(`Address ${addressId} set as default successfully.`);
  } catch (error) {
    console.error('Error setting default address:', error);
    throw error;
  }
};
