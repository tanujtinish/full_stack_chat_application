import {SIGN_UP_SUCCESS, SIGN_UP_FAIL, LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT_SUCCESS, LOGOUT_FAIL, UNSET_MESSAGE} from "./user_service_action_types";

import {login_api_call, signup_api_call, sign_out_api_call} from "../Utils/UserServiceApiUtils";

export const signupSuccessAction = (message) => ({
  type: SIGN_UP_SUCCESS,
  payload: {message},
});

export const signupFailAction = (message) => ({
  type: SIGN_UP_FAIL,
  payload: {message},
});

export const loginSuccessAction = (data) => ({
  type: LOGIN_SUCCESS,
  payload: { userInfo: data.userInfo, jwt_web_token: data.jwt_web_token },
});

export const loginFailAction = (message) => ({
  type: LOGIN_FAIL,
  payload: {message},
});

export const logOutSuccessAction = (message) => ({
  type: LOGOUT_SUCCESS,
  payload: {message},
});

export const logOutFailAction = (message) => ({
  type: LOGOUT_FAIL,
  payload: {message},
});

export const unsetMessage = () => ({
  type: UNSET_MESSAGE,
  payload: {message: ""},
});


export const signup = (username, email, password) => (dispatch) => {

  return signup_api_call(username, email, password).then(
    (messageResponse) => {
      
      dispatch(signupSuccessAction(messageResponse));

      return Promise.resolve();
    },
    (error) => {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();

      dispatch(signupFailAction(message));

      return Promise.reject();
    }
  );
};

export const login = (username, password) => (dispatch) => {

  return login_api_call(username, password).then(
    (data) => {
      dispatch(loginSuccessAction({userInfo: data.userInfo, jwt_web_token: data.jwt_web_token}));

      return Promise.resolve();
    },
    (error) => {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();

      dispatch(loginFailAction(message));

      return Promise.reject();
    }
  );
};

export const sign_out = () => (dispatch) => {

  return sign_out_api_call().then(
    (messageResponse) => {
      dispatch(logOutSuccessAction(messageResponse));

      return Promise.resolve();
    },
    (error) => {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();

      dispatch(logOutFailAction(message));

      return Promise.reject();
    }
  );
};