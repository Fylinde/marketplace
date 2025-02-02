import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { ThemeProvider } from "styled-components";
import { HelmetProvider } from "react-helmet-async"; // Import HelmetProvider
import { GlobalStyles } from "./utils/globalStyles";
import { theme } from "./utils/theme";
import store,  { persistor } from "./redux/store";
import App from "./App";
import { initializeMockService } from './mockServer'; // Import the mock service initialization
import { PersistGate } from 'redux-persist/es/integration/react';

// Initialize MockService only in development mode
if (process.env.NODE_ENV === "development") {
  console.log("Attempting to initialize MockService...");
  initializeMockService()
    .then(() => console.log("MockService Worker started successfully."))
    .catch((error: any) => console.error("Failed to start MockService Worker:", error));
}

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <HelmetProvider>
            <GlobalStyles />
            <App />
          </HelmetProvider>
        </ThemeProvider>
      </BrowserRouter>
    </PersistGate>
  </Provider>
);