import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { GlobalStyles } from "./utils/globalStyles";
import { theme } from "./utils/theme";
import NavbarLayout from "./components/layout/NavbarLayout";
import IndexPage from "pages1";
import UserRegistrationParent from "./components/UserRegistrationParent/UserRegistrationParent";
import IndividualSellerRegistration from "./components/ParentSellerRegistrationParent/IndividualSellerRegistration";
import ProfessionalSellerRegistration from "./components/ParentSellerRegistrationParent/ProfessionalSellerRegistration";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import UserDashboard from "./components/UserDashboard/UserDashboard";
import WelcomeScreen from "./components/Registration/WelcomeScreen";
import SellerDashboard from "./components/Seller/SellerDashboard";
import { SearchProvider } from "./context/SearchContext";
import ErrorBoundary from "./components/ErrorBoundary";
import TypeSelectionPage from "./pages1/TypeSelectionPage";

// Lazy load Seller Dashboard modules for performance optimization
const AccountSettings = React.lazy(() => import("./components/dashboard/AccountSettings"));
const Advertising = React.lazy(() => import("./components/dashboard/Advertising"));
const OrderManagement = React.lazy(() => import("./components/dashboard/OrderManagement"));
const Payment = React.lazy(() => import("./components/dashboard/Payment"));
const Enhancements = React.lazy(() => import("./components/dashboard/Enhancements"));
const Security = React.lazy(() => import("./components/dashboard/Security"));
const Shipping = React.lazy(() => import("./components/dashboard/Shipping"));
const Support = React.lazy(() => import("./components/dashboard/Support"));
const ProductManagement = React.lazy(() => import("./components/dashboard/ProductManagement"));
const AnalyticsDashboard = React.lazy(() => import("./components/dashboard/AnalyticsDashboard"));
const PerformanceMetrics = React.lazy(() => import("./components/dashboard/PerformanceMetrics"));

const renderWithLayout = (PageComponent: any) => {
  const Layout = PageComponent.layout || NavbarLayout;
  return (
    <Layout>
      <PageComponent />
    </Layout>
  );
};

const App: React.FC = () => {
  console.log("[App] Rendering App...");

  return (
    <SearchProvider>
      <GlobalStyles />
      <ErrorBoundary>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            {/* Main routes */}
            <Route path="/" element={renderWithLayout(IndexPage)} />
            <Route path="/register/*" element={<UserRegistrationParent />} />
            <Route path="/register/type-selection" element={<TypeSelectionPage />} />
            <Route path="/register/seller/individual/*" element={<IndividualSellerRegistration />} />
            <Route path="/register/seller/professional/*" element={<ProfessionalSellerRegistration />} />

            <Route
              path="/user-dashboard"
              element={
                <ProtectedRoute>
                  {renderWithLayout(UserDashboard)}
                </ProtectedRoute>
              }
            />
            <Route path="/welcome" element={renderWithLayout(WelcomeScreen)} />

            {/* Seller Dashboard Routes */}
            <Route
              path="/seller-dashboard/*"
              element={
                <ProtectedRoute>
                  {renderWithLayout(SellerDashboard)}
                </ProtectedRoute>
              }
            >
              {/* Nested Seller Dashboard Routes */}
              <Route path="overview" element={<SellerDashboard />} />
              <Route path="account-settings/*" element={<AccountSettings />} />
              <Route path="advertising/*" element={<Advertising />} />
              <Route path="order-management/*" element={<OrderManagement />} />
              <Route path="payment/*" element={<Payment />} />
              <Route path="enhancements/*" element={<Enhancements />} />
              <Route path="security/*" element={<Security />} />
              <Route path="shipping/*" element={<Shipping />} />
              <Route path="support/*" element={<Support />} />
              <Route path="product-management/*" element={<ProductManagement />} />
              <Route path="analytics" element={<AnalyticsDashboard />} />
              <Route path="performance-metrics/*" element={<PerformanceMetrics />} />

              {/* Fallback for undefined routes */}
              <Route path="*" element={<div>Page not found</div>} />
            </Route>

            {/* Fallback for undefined routes */}
            <Route path="*" element={<div>Page not found</div>} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </SearchProvider>
  );
};

export default App;
