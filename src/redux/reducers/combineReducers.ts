import { Reducer, Action as ReduxAction } from 'redux';

// Action type with optional payload, ensuring `T` is always a string
type Action<T extends string = string> = ReduxAction<T> & {
  payload?: any;
};

// ReducersMapObject allows each key in the state to have its own specific reducer
type ReducersMapObject<S = any, A extends Action = Action> = {
  [K in keyof S]: Reducer<S[K], A>; // Maps each key in state `S` to a reducer that handles that slice of the state
};

// Modified combineReducers function to use better typing for reducers
const combineReducers = <S, A extends Action<string>>(reducers: ReducersMapObject<S, A>) => {
  return (state: S = {} as S, action: A): S => {
    const newState: S = {} as S;

    for (let key in reducers) {
      if (Object.prototype.hasOwnProperty.call(reducers, key)) {
        newState[key] = reducers[key](state[key], action);
      }
    }

    return newState;
  };
};

export default combineReducers;
