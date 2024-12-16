import { Reducer } from 'redux';

export const TOGGLE_HEADER = "TOGGLE_HEADER";

export const layoutInitialState = {
  isHeaderFixed: false,
};

export type layoutStateType = typeof layoutInitialState;

export type layoutActionType = {
  type: typeof TOGGLE_HEADER;
  payload: boolean;
};

// Redux Reducer for layout
export const layoutReducer: Reducer<layoutStateType, layoutActionType> = (
  state = layoutInitialState,
  action
) => {
  switch (action.type) {
    case TOGGLE_HEADER:
      return {
        ...state,
        isHeaderFixed: action.payload,
      };

    default:
      return state;
  }
};
