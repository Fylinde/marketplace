import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import ProductDetailPage from './pages/ProductDetailPage';
import UserAccountPage from './pages/UserAccountPage';
import VendorDashboardPage from './pages/VendorDashboardPage';
import VendorStorefrontPage from './pages/VendorStorefrontPage';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import SignInForm from './components/Registration/SignInForm';
import CreateAccount from './components/Registration/CreateAccount';
import EmailVerification from './components/Registration/EmailVerification';
import UserDashboard from './components/UserDashboard/UserDashboard';
import RequestOTPForm from './components/Registration/RequestOTPForm';
import VerifyOTPForm from './components/Registration/VerifyOTPForm';
import CreateSellerAccount from './components/Registration/CreateSellerAccount';
import WelcomeScreen from './components/Registration/WelcomeScreen';
import Signout from './components/Registration/Signout';
import AddressList from './components/AddressManagement/AddressList';
import AddressForm from './components/AddressManagement/AddressForm';
import EditAddressPopup from './components/AddressManagement/EditAddressPopup';
import RemoveAddressPopup from './components/AddressManagement/RemoveAddressPopup';
import ParentComponent from './components/ParentComponent/ParentComponent';  // Centralized seller registration

const App: React.FC = () => {
  const [selectedAddress, setSelectedAddress] = useState<any | null>(null);
  const [showRemovePopup, setShowRemovePopup] = useState<boolean>(false);

  const handleEditAddress = (addressId: number) => {
    setSelectedAddress({
      id: addressId,
      street: '123 Main St',
      city: 'Example City',
      state: 'Example State',
      postal_code: '12345',
      country: 'Example Country',
    });
  };

  const handleRemoveAddress = (addressId: number) => {
    setSelectedAddress({
      id: addressId,
      street: '123 Main St',
      city: 'Example City',
      state: 'Example State',
      postal_code: '12345',
      country: 'Example Country',
    });
    setShowRemovePopup(true);
  };

  const handleConfirmRemove = () => {
    setShowRemovePopup(false);
    setSelectedAddress(null);
  };

  const handleCancelRemove = () => {
    setShowRemovePopup(false);
    setSelectedAddress(null);
  };

  return (
    <Router>
      <Header />
      <div className="main-layout">
        <main>
          <Routes>
            {/* Ordinary User Registration Routes */}
            <Route path="/sign-in" element={<SignInForm />} />
            <Route path="/create-account" element={<CreateAccount />} />
            <Route path="/email-verification" element={<EmailVerification />} />
            <Route path="/request-otp" element={<RequestOTPForm />} />
            <Route path="/verify-otp" element={<VerifyOTPForm />} />
            <Route path="/user-dashboard" element={<UserDashboard />} />
            <Route path="/sign-out" element={<Signout />} />
            <Route path="/create-seller-account" element={<CreateSellerAccount />} />
            <Route path="/welcome" element={<WelcomeScreen />} />

            {/* Seller Registration Routes handled by ParentComponent */}
             {/*<Route path="/register/individual/*" element={<ParentComponent />} /> {/* All seller forms managed by ParentComponent */} 
            <Route path="/register/*" element={<ParentComponent />} /> 

            {/* Address Management */}
            <Route path="/addresses" element={<AddressList />} />
            <Route path="/addresses/add" element={<AddressForm />} />
            <Route
              path="/addresses/edit/:id"
              element={
                <EditAddressPopup
                  address={selectedAddress}
                  onConfirm={handleEditAddress}
                  onCancel={() => setSelectedAddress(null)}
                />
              }
            />
            <Route
              path="/addresses/remove"
              element={
                showRemovePopup && (
                  <RemoveAddressPopup
                    address={selectedAddress}
                    onConfirm={handleConfirmRemove}
                    onCancel={handleCancelRemove}
                  />
                )
              }
            />

            {/* Protected Routes */}
            <Route
              path="/user-account"
              element={
                <ProtectedRoute>
                  <UserAccountPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/vendor-dashboard"
              element={
                <ProtectedRoute>
                  <VendorDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route path="/vendor/:id" element={<VendorStorefrontPage />} />

            {/* Other Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/category/:id" element={<CategoryPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
          </Routes>
        </main>
      </div>
      <Footer />
    </Router>
  );
};

export default App;
