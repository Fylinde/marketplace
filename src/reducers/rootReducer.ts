import combineReducers from './combineReducers'; // Default import
import { cartReducer, cartStateType, cartActionType, cartInitialState } from './cartReducer';
import { layoutReducer, layoutStateType, layoutActionType, layoutInitialState } from './layoutReducer';

// Define the root action type, combining layout and cart action types
export type rootActionType = cartActionType | layoutActionType;

// Define the root state type, combining layout and cart state types
export type rootStateType = {
  layout: layoutStateType;
  cart: cartStateType;
};

// Combine reducers using the updated combineReducers function
export const rootReducer = combineReducers<rootStateType, rootActionType>({
  layout: (state, action) => {
    // Ensure the action is of type layoutActionType before passing to layoutReducer
    if ('TOGGLE_HEADER' in action) {
      return layoutReducer(state, action as layoutActionType);
    }
    return state as layoutStateType;
  },
  cart: (state, action) => {
    // Ensure the action is of type cartActionType before passing to cartReducer
    if ('CHANGE_CART_AMOUNT' in action) {
      return cartReducer(state, action as cartActionType);
    }
    return state as cartStateType;
  },
});

// Define the initial state for the entire app by combining individual initial states
export const initialState: rootStateType = {
  layout: layoutInitialState,
  cart: cartInitialState,
};
