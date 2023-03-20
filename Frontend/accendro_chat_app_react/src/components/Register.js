import React, { useState, useRef } from "react";

import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import { isEmail } from "validator";

import {signup_api_call} from "../Utils/UserServiceApiUtils";

import css from "../css/Register.css";

const required = (value) => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        This field is required!
      </div>
    );
  }
};

const validEmail = (value) => {
  if (!isEmail(value)) {
    return (
      <div className="alert alert-danger" role="alert">
        This is not a valid email.
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

const Register = () => {
  const form = useRef();
  const checkBtn = useRef();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [successful, setSuccessful] = useState(false);
  const [loading, setLoading] = useState(false);

  const [signup_message, setSignup_message] = useState(false);

  const onChangeUsername = (e) => {
    const username = e.target.value;
    setUsername(username);
  };

  const onChangeEmail = (e) => {
    const email = e.target.value;
    setEmail(email);
  };

  const onChangePassword = (e) => {
    const password = e.target.value;
    setPassword(password);
  };

  const signupUtil = (username, email, password) => {

    return signup_api_call(username, email, password).then(
      (messageResponse) => {
        setSignup_message(messageResponse.message);
  
        return Promise.resolve();
      },
      (error) => {
        const message =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
            
          setSignup_message(message);
  
        return Promise.reject();
      }
    );
  };

  const handleRegister = (e) => {
    e.preventDefault();

    setSuccessful(false);
    setLoading(true);

    form.current.validateAll();

    if (checkBtn.current.context._errors.length === 0) {
      signupUtil(username, email, password)
        .then(() => {
          setLoading(false);
          setSuccessful(true);
        })
        .catch(() => {
          setLoading(false);
          setSuccessful(false);
        });
    }
  };

  return (
    <div className="form-container sign-up-container" data-testid="Register-component">
      <Form onSubmit={handleRegister} ref={form}>
        <h1>Create Account</h1>
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
            type="text"
            className="form-control"
            name="email"
            value={email}
            onChange={onChangeEmail}
            validations={[required, validEmail]}
            placeholder="Email"
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
        <button disabled={loading}>
            {loading ? 
                <span className="spinner-border spinner-border-sm"></span>
                : <span>Sign Up!</span>
            }
        </button>
        {signup_message && (
          <div className="form-group">
              <div className={ successful ? "alert alert-success" : "alert alert-danger" } role="alert">
              {signup_message}
              </div>
          </div>
        )}
        <CheckButton style={{ display: "none" }} ref={checkBtn} />
      </Form>
    </div>
  );
};

export default React.memo(Register);;
