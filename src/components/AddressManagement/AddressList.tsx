import React, { useEffect, useState } from 'react';
import { getUserAddresses, deleteUserAddress, setDefaultAddress } from '../../services/addressService';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { useNavigate, useLocation } from 'react-router-dom'; // Import useNavigate for navigation
import './AddressList.css';
import RemoveAddressPopup from './RemoveAddressPopup'; // Import the popup component

const AddressList: React.FC = () => {
  const location = useLocation();  // Get the location object
  const navigate = useNavigate(); // Initialize navigate hook
  const [addresses, setAddresses] = useState<any[]>([]);
  const [showRemovePopup, setShowRemovePopup] = useState(false); // Track whether the popup is visible
  const [addressToRemove, setAddressToRemove] = useState<any | null>(null); // Track the address to remove
  const userId = useSelector((state: RootState) => state.auth.user?.id);

  const handleAddAddress = () => {
    navigate('/addresses/add'); // Navigate to the add address form
  };

  useEffect(() => {
    const fetchAddresses = async () => {
      if (userId) {
        try {
          const fetchedAddresses = await getUserAddresses(userId);
          console.log('Fetched addresses: ', fetchedAddresses); // Log fetched addresses to ensure it's returning the correct data
          setAddresses(fetchedAddresses);
        } catch (error) {
          console.error('Failed to fetch addresses:', error);
        }
      } else {
        console.error('User ID is missing, unable to fetch addresses');
      }
    };

    fetchAddresses();
  }, [userId, location.state?.newAddressAdded]);

  const handleSetDefault = async (id: number) => {
    await setDefaultAddress(id);
    const updatedAddresses = addresses.map((address) =>
      address.id === id ? { ...address, is_default: true } : { ...address, is_default: false }
    );
    setAddresses(updatedAddresses);
  };

  const confirmDeleteAddress = async () => {
    if (addressToRemove) {
      try {
        await deleteUserAddress(addressToRemove.id);
        setAddresses((prevAddresses) =>
          prevAddresses.filter((address) => address.id !== addressToRemove.id)
        );
        console.log('Updated addresses after deletion: ', addresses);
        setShowRemovePopup(false); // Hide the popup after deletion
        setAddressToRemove(null);  // Reset the selected address for deletion
      } catch (error) {
        console.error('Error deleting address:', error);
      }
    }
  };

  // Show the delete confirmation popup with error handling
  const handleDeleteAddress = (address: any) => {
    setAddressToRemove(address);  // Set the address to remove
    setShowRemovePopup(true);     // Show the confirmation popup

    // Ensure the popup shows and block any further action if it doesn't
    setTimeout(() => {
      if (!showRemovePopup) {
        console.error('Error: Remove address popup failed to show.');
        throw new Error('Remove address popup failed to show.');
      }
    }, 500);
  };

  // New function that prevents any navigation if the popup fails to show
  const handleNavigation = (newPageUrl: string) => {
    // Check if the popup is open before navigating
    if (showRemovePopup) {
      console.error("Navigation blocked: Popup is open.");
      return; // Block navigation
    } else {
      // Proceed with navigation if popup is not open
      navigate(newPageUrl);
    }
  };

  const cancelDelete = () => {
    setShowRemovePopup(false);
    setAddressToRemove(null);
  };

  return (
    <div className="address-list-container">
      <h2>Your Addresses</h2>
      <div className="address-list">
        {addresses.map((address) => (
          <div key={address.id} className={`address-card ${address.is_default ? 'default' : ''}`}>
            <p>{address.street}, {address.city}, {address.state}, {address.postal_code}, {address.country}</p>
            <p>Phone number: {address.phone_number}</p>
            {address.is_default && <span>Default</span>}
            <div className="address-actions">
              <button>Edit</button>
              <button onClick={() => handleDeleteAddress(address)}>Remove</button> {/* Trigger popup on remove */}
              {!address.is_default && (
                <button onClick={() => handleSetDefault(address.id)}>Set as Default</button>
              )}
            </div>
          </div>
        ))}
        <div className="add-address-card" onClick={() => handleNavigation('/addresses/add')}>
          + Add Address
        </div>
      </div>

      {/* Show the confirmation popup */}
      {showRemovePopup && addressToRemove && (
        <RemoveAddressPopup
          address={addressToRemove}
          onConfirm={confirmDeleteAddress}
          onCancel={cancelDelete}
        />
      )}
    </div>
  );
};

export default AddressList;
