import {configureStore} from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import rootReducer from "./reducers";

const middleware = [thunk];

const store = configureStore({
  reducer: rootReducer,
});

store.subscribe(() => {
  // get the latest state from the store
  const state = store.getState();

  // save the state to local storage
  localStorage.setItem('state', JSON.stringify(state));
});

export default store;
