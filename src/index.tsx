import React from 'react';
import ReactDOM from 'react-dom/client'; // For React 18
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter
import { HelmetProvider } from 'react-helmet-async';
import App from './App';
import { AppProvider } from 'contexts/app/AppContext';
import { ThemeProvider } from 'styled-components';
import { GlobalStyles } from 'utils/globalStyles';
import theme from 'utils/theme';
import { Provider } from 'react-redux';
import store from './redux/store';
import ErrorBoundary from './components/ErrorBoundary';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <HelmetProvider>
    <React.StrictMode>
      <ThemeProvider theme={theme}>  
        <GlobalStyles />
        <AppProvider>
        <Provider store={store}>
          <BrowserRouter> {/* Add BrowserRouter here */}
          <ErrorBoundary>
              <App />
          </ErrorBoundary>
          </BrowserRouter>
          </Provider>
        </AppProvider>
      </ThemeProvider>
    </React.StrictMode>
  </HelmetProvider>

  
);
