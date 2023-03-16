import {LOGIN_SUCCESS, LOGOUT_SUCCESS, LOGOUT_FAIL} from "./user_service_action_types";

import {sign_out_api_call} from "../Utils/UserServiceApiUtils";

export const loginSuccessAction = (data) => ({
  type: LOGIN_SUCCESS,
  payload: { userInfo: data.userInfo, jwt_web_token: data.jwt_web_token },
});

export const logOutSuccessAction = (message) => ({
  type: LOGOUT_SUCCESS,
  payload: {message},
});

export const logOutFailAction = (message) => ({
  type: LOGOUT_FAIL,
  payload: {message},
});

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