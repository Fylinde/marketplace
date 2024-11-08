import React from "react";
import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { Provider } from "react-redux";
import { GlobalStyles } from "utils/globalStyles";
import store from "./redux/store";
import { theme } from "./utils/theme";
import NavbarLayout from "components/layout/NavbarLayout";
import IndexPage from "pages1";
import { PageWithLayout } from "types/pageLayouts";
import UserRegistrationParent from "components/UserRegistrationParent/UserRegistrationParent";
import SellerRegistrationParent from "components/SellerRegistrationParent/SellerRegistrationParent";
import ProtectedRoute from "components/ProtectedRoute/ProtectedRoute";
import UserDashboard from "components/UserDashboard/UserDashboard";
import WelcomeScreen from "components/Registration/WelcomeScreen";
import VendorDashboard from "./components/Vendor/VendorDashboard";

// Helper function to wrap pages with the appropriate layout
const renderWithLayout = (PageComponent: PageWithLayout) => {
  const Layout = PageComponent.layout || NavbarLayout;
  return (
    <Layout>
      <PageComponent />
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <Routes>
          <Route path="/" element={renderWithLayout(IndexPage)} />
          <Route path="/register/*" element={<UserRegistrationParent />} />
          <Route path="/register/seller/*" element={<SellerRegistrationParent />} />

          <Route
            path="/user-dashboard"
            element={
              <ProtectedRoute>
                {renderWithLayout(UserDashboard)}
              </ProtectedRoute>
            }
          />
          <Route path="/welcome" element={renderWithLayout(WelcomeScreen)} />

          <Route
            path="/vendor-dashboard"
            element={
              <ProtectedRoute>
                {renderWithLayout(VendorDashboard)}
              </ProtectedRoute>
            }
          />
        </Routes>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
