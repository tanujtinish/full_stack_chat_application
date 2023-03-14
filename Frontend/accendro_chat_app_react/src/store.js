import {createStore} from "@reduxjs/toolkit";
import { applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import rootReducer from "./reducers";

const middleware = [thunk];

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(...middleware))
);

store.subscribe(() => {
  // get the latest state from the store
  const state = store.getState();

  // save the state to local storage
  localStorage.setItem('state', JSON.stringify(state));
});

export default store;
