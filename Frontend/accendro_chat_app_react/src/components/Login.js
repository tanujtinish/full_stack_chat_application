import React, { useState, useRef } from "react";
import { useDispatch } from "react-redux";

import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import css from "../css/Login.css";
import {login_api_call} from "../Utils/UserServiceApiUtils";
import { useNavigate } from "react-router-dom";

import { loginSuccessAction } from "../actions/UserServiceActions";

const required = (value) => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        This field is required!
      </div>
    );
  }
};

const vusername = (value) => {
  if (value.length < 3 || value.length > 50) {
    return (
      <div className="alert alert-danger" role="alert">
        The username must be between 3 and 20 characters.
      </div>
    );
  }
};

const vpassword = (value) => {
  if (value.length < 6 || value.length > 64) {
    return (
      <div className="alert alert-danger" role="alert">
        The password must be between 6 and 40 characters.
      </div>
    );
  }
};

const Login = () => {

  const form = useRef();
  const checkBtn = useRef();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [successful, setSuccessful] = useState(false);

  const [login_message, setLogin_message] = useState("");

  const dispatch = useDispatch();

  const onChangeUsername = (e) => {
    const username = e.target.value;
    setUsername(username);
  };

  const onChangePassword = (e) => {
    const password = e.target.value;
    setPassword(password);
  };

  const loginUtil = (username, password) => (dispatch) => {

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
            
          setLogin_message(message);
  
        return Promise.reject();
      }
    );
  };

  const navigate = useNavigate();
  const handleLogin = (e) => {
    e.preventDefault();

    setLoading(true);
    setSuccessful(false);

    form.current.validateAll();

    if (checkBtn.current.context._errors.length === 0) {
      dispatch(loginUtil(username, password))
        .then(() => {
          navigate('/chat');
        })
        .catch(() => {
          setLoading(false);
          setSuccessful(false);
        });
    } else {
      setLoading(false);
      setSuccessful(true);
    }
  };

  return (
      <div className="form-container sign-in-container">
        <Form onSubmit={handleLogin} ref={form}>
          <h1>Sign in</h1>
          <span>or use your account</span>
          <Input
            type="text"
            className="form-control"
            name="username"
            value={username}
            onChange={onChangeUsername}
            validations={[required, vusername]}
            placeholder="username"
          />
          <Input
            type="password"
            className="form-control"
            name="password"
            value={password}
            onChange={onChangePassword}
            validations={[required, vpassword]}
            placeholder="password"
          />
          <a href="#">Forgot your password?</a>
          <button disabled={loading}>
              {loading ? 
                  <span className="spinner-border spinner-border-sm"></span>
                  : <span>Login</span>
              }
          </button>
          {login_message && (
            <div className="form-group">
                <div className={ successful ? "alert alert-success" : "alert alert-danger" } role="alert">
                {login_message}
                </div>
            </div>
          )}
            <CheckButton style={{ display: "none" }} ref={checkBtn} />
        </Form>
      </div>
      
  );
};

export default React.memo(Login);
