import {LOGIN_SUCCESS, LOGOUT_SUCCESS, LOGOUT_FAIL, UNSET_MESSAGE, GET_USERS_SUCCESS, GET_USERS_FAIL} from "../actions/user_service_action_types";

const initialState = { isLoggedIn: false, userInfo: {id:-1, username:""}, jwt_web_token:"", logout_message: "", get_users_message:"", all_users: [] };

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case LOGIN_SUCCESS:
      return {
        ...state,
        isLoggedIn: true,
        userInfo: payload.userInfo,
        jwt_web_token: payload.jwt_web_token,
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
