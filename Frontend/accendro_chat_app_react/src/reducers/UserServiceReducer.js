import {SIGN_UP_SUCCESS, SIGN_UP_FAIL, LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT_SUCCESS, LOGOUT_FAIL, UNSET_MESSAGE, GET_USERS_SUCCESS, GET_USERS_FAIL} from "../actions/user_service_action_types";

const initialState = { isLoggedIn: false, userInfo: null, jwt_web_token:"", signup_message: "", login_message: "", logout_message: "", get_users_message:"", all_users: [] };

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case SIGN_UP_SUCCESS:
      return {
        ...state,
        isLoggedIn: false,
        signup_message: payload.message.message,
      };
    case SIGN_UP_FAIL:
      return {
        ...state,
        isLoggedIn: false,
        signup_message: payload.message,
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
        login_message: payload.message,
      };
    case LOGOUT_SUCCESS:
      return {
        ...state,
        isLoggedIn: false,
        userInfo: null,
        logout_message: payload.message.message,
        jwt_web_token: "",
      };
    case LOGOUT_FAIL:
      return {
        ...state,
        isLoggedIn: false,
        userInfo: null,
        logout_message: payload.message,
      };
    case GET_USERS_SUCCESS:
      return {
        ...state,
        all_users: payload.all_users,
      };
    case GET_USERS_FAIL:
      return {
        ...state,
        get_users_message: payload.message,
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
