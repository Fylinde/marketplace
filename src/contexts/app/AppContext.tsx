import React, { createContext, useContext, useMemo, useReducer } from 'react';
import { rootReducer, initialState as defaultInitialState } from '../../reducers/rootReducer'; // Ensure this is correctly imported

// import { rootActionType } from '../../reducers/rootReducer';


// Temporarily simplify the typing by using `any` to debug the issue
interface AppContextType {
  state: any; // Using `any` for state to debug the issue
  dispatch: React.Dispatch<any>;
}

// Create the context with the simplified type
const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(rootReducer, defaultInitialState);

  // Debugging the state structure
  console.log("Current state:", state); // Check this in the browser console to confirm the actual structure of the state

  const contextValue = useMemo(() => ({ state, dispatch }), [state, dispatch]);

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export default AppContext;
