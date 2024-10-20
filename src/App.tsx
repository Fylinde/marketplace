import $ from 'jquery';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { RootState } from './redux/store';
import { setAuthData } from './redux/slices/authSlice';
import Header from './components/Header/Header1';
import Footer from './components/Footer/Footer1';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import ProductDetailPage from './pages/ProductDetailPage';
import UserAccountPage from './pages/UserAccountPage';
import VendorDashboardPage from './pages/VendorDashboardPage';
import VendorStorefrontPage from './pages/VendorStorefrontPage';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import RegistrationLayout from './pages/RegistrationLayout';
import SellerLayout from './pages/SellerLayout';
import UserDashboard from './components/UserDashboard/UserDashboard';
import Nav from './components/Nav/Nav'; // Import Nav component
import AddressManagement from './pages/AddressManagement';
import AddressList from './components/AddressManagement/AddressList';

const App: React.FC = () => {
  const dispatch = useDispatch();
  const authState = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const storedToken = localStorage.getItem('access_token');
    const storedRefreshToken = localStorage.getItem('refresh_token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedRefreshToken && storedUser) {
      dispatch(setAuthData({
        access_token: storedToken,
        refresh_token: storedRefreshToken,
        user: JSON.parse(storedUser)
      }));
    }
  }, [dispatch]);

  return (
    <Router>
      <Header />
      <Nav />  {/* Add Nav component here */}
      <div className="main-layout">
        <main>
          <Routes>
          <Route path="registration/*" element={<RegistrationLayout />} />

            <Route path="/user-dashboard" element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            } />
            <Route path="/addresses" element={
              <ProtectedRoute>
                <AddressList />
              </ProtectedRoute>
              } />
            <Route path="/address-management" element={
              <ProtectedRoute>
                <AddressManagement />
              </ProtectedRoute>
            } />
            <Route path="register/*" element={<SellerLayout />} />
            <Route path="/user-account" element={
              <ProtectedRoute>
                <UserAccountPage />
              </ProtectedRoute>
            } />
            
            <Route path="/vendor-dashboard" element={
              <ProtectedRoute>
                <VendorDashboardPage />
              </ProtectedRoute>
            } />
            <Route path="/vendor/:id" element={<VendorStorefrontPage />} />
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
