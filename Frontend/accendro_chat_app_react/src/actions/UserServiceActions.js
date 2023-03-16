import {LOGIN_SUCCESS, LOGOUT_SUCCESS, LOGOUT_FAIL, UNSET_MESSAGE, GET_USERS_SUCCESS, GET_USERS_FAIL} from "./user_service_action_types";

import {sign_out_api_call, get_users_api_call} from "../Utils/UserServiceApiUtils";
import {count_new_messgaes_api_call} from "../Utils/ChatServiveApiUtils";

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

export const getUsersSuccessAction = (all_users) => ({
  type: GET_USERS_SUCCESS,
  payload: {all_users: all_users},
});

export const getUsersFailAction = (message) => ({
  type: GET_USERS_FAIL,
  payload: {message},
});

export const unsetMessage = () => ({
  type: UNSET_MESSAGE,
  payload: {message: ""},
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

export const get_users = (currentUser) => (dispatch) => {

  return get_users_api_call().then(
    (usersListResponse) => {

      usersListResponse.map((user) => {
        count_new_messgaes_api_call(user.id, currentUser.id).then((count) => {
          user.newMessages = count;
          return user;
        })
      })
      //id, username, email, roles, newMessages
      dispatch(getUsersSuccessAction(usersListResponse));

      return Promise.resolve();
    },
    (error) => {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();

      dispatch(getUsersFailAction(message));

      return Promise.reject();
    }
  );
};