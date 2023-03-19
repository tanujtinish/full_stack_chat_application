import {LOGIN_SUCCESS, LOGOUT} from "./user_service_action_types";

export const loginSuccessAction = (data) => ({
  type: LOGIN_SUCCESS,
  payload: { userInfo: data.userInfo, jwt_web_token: data.jwt_web_token },
});

export const logOutAction = () => ({
  type: LOGOUT,
  payload: null,
});