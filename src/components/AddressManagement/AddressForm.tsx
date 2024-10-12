import React, { useState } from 'react';
import { addUserAddress } from '../../services/addressService';
import { useNavigate } from 'react-router-dom';
import './AddressForm.css';

const AddressForm: React.FC = () => {
    const navigate = useNavigate();
    const [newAddress, setNewAddress] = useState({
        street: '',
        city: '',
        state: '',
        postal_code: '',
        country: '',
        phone_number: '',
    });
    
    // Error handling state
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewAddress({ ...newAddress, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Submitting new address: ", newAddress);
    
        try {
            // Call the service to add the new address
            await addUserAddress(newAddress);
            
            // If successful, navigate to the address list and pass state indicating a new address was added
            navigate('/addresses', { state: { newAddressAdded: true } });
            
            console.log("Address added successfully");
        } catch (error: any) {
            // Handle errors and display error messages if needed
            if (error.response && error.response.data) {
                setErrorMessage(error.response.data.detail || "Failed to add address");
            } else {
                setErrorMessage("An unexpected error occurred while adding the address.");
            }
            console.error("Error adding address: ", error);
        }
    };
    

    return (
        <div className="address-form-container">
            <h2>Add a new address</h2>
            
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            
            <form onSubmit={handleSubmit}>
                <input type="text" name="street" placeholder="Street" onChange={handleChange} />
                <input type="text" name="city" placeholder="City" onChange={handleChange} />
                <input type="text" name="state" placeholder="State" onChange={handleChange} />
                <input type="text" name="postal_code" placeholder="Postal Code" onChange={handleChange} />
                <input type="text" name="country" placeholder="Country" onChange={handleChange} />
                <input type="text" name="phone_number" placeholder="Phone Number" onChange={handleChange} />
                <button type="submit">Add Address</button>
            </form>
        </div>
    );
};

export default AddressForm;
