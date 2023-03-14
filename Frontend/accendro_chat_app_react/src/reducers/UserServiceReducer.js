import {SIGN_UP_SUCCESS, SIGN_UP_FAIL, LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT_SUCCESS, LOGOUT_FAIL, UNSET_MESSAGE} from "../actions/user_service_action_types";

const initialState = { isLoggedIn: false, userInfo: null, jwt_web_token:"", message: "" };

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case SIGN_UP_SUCCESS:
      return {
        ...state,
        isLoggedIn: false,
        message: payload.message,
      };
    case SIGN_UP_FAIL:
      return {
        ...state,
        isLoggedIn: false,
        message: payload.message,
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        isLoggedIn: true,
        userInfo: payload.userInfo,
        jwt_web_token: payload.jwt_web_token,
      };
    case LOGIN_FAIL:
      return {
        ...state,
        isLoggedIn: false,
        userInfo: null,
        message: payload.message,
      };
    case LOGOUT_SUCCESS:
      return {
        ...state,
        isLoggedIn: false,
        userInfo: null,
        message: payload.message,
        jwt_web_token: "",
      };
    case LOGOUT_FAIL:
      return {
        ...state,
        isLoggedIn: false,
        userInfo: null,
        message: payload.message,
      };
    case UNSET_MESSAGE:
      return {
        ...state,
        message: "",
      };
    default:
      return state;
  }
}
