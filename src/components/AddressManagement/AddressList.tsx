import React, { useEffect, useState } from 'react';
import { getUserAddresses, deleteUserAddress, setDefaultAddress } from '../../services/addressService';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { useNavigate, useLocation } from 'react-router-dom';
import './AddressList.css';
import RemoveAddressPopup from './RemoveAddressPopup';

const AddressList: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState<any[]>([]);
  const [showRemovePopup, setShowRemovePopup] = useState(false);
  const [addressToRemove, setAddressToRemove] = useState<any | null>(null);
  const userId = useSelector((state: RootState) => state.auth.user?.id);

  // Function to handle navigation, ensuring no navigation when the popup is open
  const handleNavigation = (newPageUrl: string) => {
    if (showRemovePopup) {
      console.error("Navigation blocked: Popup is open.");
      return;
    } else {
      navigate(newPageUrl);
    }
  };

  // Simplified handleAddAddress function
  const handleAddAddress = () => {
    console.log("Navigating to addresses page");
     handleNavigation('/address-management');
   // window.location.href = '/addresses';
  };

  useEffect(() => {
    const fetchAddresses = async () => {
      if (userId) {
        try {
          const fetchedAddresses = await getUserAddresses(userId);
          console.log('Fetched addresses: ', fetchedAddresses);
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
        setShowRemovePopup(false);
        setAddressToRemove(null);
      } catch (error) {
        console.error('Error deleting address:', error);
      }
    }
  };

  const handleDeleteAddress = (address: any) => {
    setAddressToRemove(address);
    setShowRemovePopup(true);

    setTimeout(() => {
      if (!showRemovePopup) {
        console.error('Error: Remove address popup failed to show.');
        throw new Error('Remove address popup failed to show.');
      }
    }, 500);
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
              <button onClick={() => handleDeleteAddress(address)}>Remove</button>
              {!address.is_default && (
                <button onClick={() => handleSetDefault(address.id)}>Set as Default</button>
              )}
            </div>
          </div>
        ))}
        <div className="add-address-card" onClick={handleAddAddress}>
          + Add Address
        </div>
      </div>

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
