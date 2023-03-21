import {LOGIN_SUCCESS, LOGOUT} from "../actions/user_service_action_types";

const initialState = { isLoggedIn: false, userInfo: {id:-1, username:""}, jwt_web_token:"", logout_message: ""};

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
    case LOGOUT:
      return {
        ...state,
        isLoggedIn: false,
        userInfo: {id:-1, username:""},
        jwt_web_token: "",
      };
    default:
      return state;
  }
}
