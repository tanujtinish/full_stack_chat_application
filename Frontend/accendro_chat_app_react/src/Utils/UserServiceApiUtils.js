import axios from "axios";
import {USER_SERVICE_BASE_API_URL, USER_SERVICE_USER_BASE_API_URL} from "../APIS/BaseAPIConstanats"

export function signup_api_call(username, email, password){

  return axios.post(USER_SERVICE_BASE_API_URL + "sign_up", {
    username,
    email,
    password,
  })
  .then((res) => {
    return res.data;
  });

};

export function login_api_call(username, password){

  return axios
    .post(USER_SERVICE_BASE_API_URL + "log_in", {
      username,
      password,
    })
    .then((res) => {
      if (res && res.data) {
        const cookies = res.headers['set-cookie'];
        // localStorage.setItem("jwt_web_token", JSON.stringify(cookies));
        // localStorage.setItem("userInfo", JSON.stringify(res.data));
        return {userInfo: res.data, jwt_web_token: JSON.stringify(cookies)};
      }
      else
        return {userInfo: "", jwt_web_token: ""};

      
    });

};

export function sign_out_api_call(){
  return axios
    .post(USER_SERVICE_BASE_API_URL + "log_out", {})
    .then((res) => {
      return res.data;
    });
};

export function get_users_api_call(userId){
  return axios
    .get(USER_SERVICE_USER_BASE_API_URL + "users/" + userId)
    .then((res) => {
      return res.data;
    });
};
