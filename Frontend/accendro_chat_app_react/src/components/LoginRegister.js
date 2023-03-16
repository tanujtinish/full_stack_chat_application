import React, { useState, useEffect } from "react";

import { useSelector } from "react-redux";

import Register from "./Register"
import Login from "./Login"

import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

import css from "../css/LoginRegister.css";

const LoginRegister = (props) => {

    const [isRightPanelActive, setIsRightPanelActive] = useState(false);
    const classNames =  `${isRightPanelActive ? 'container right-panel-active' : 'container'}`;

    const {isLoggedIn: isLoggedIn } = useSelector(state => state.UserServiceReducer);

    const handleSignUp = (e) => {
        e.preventDefault();
        
        setIsRightPanelActive(true);
    }

    const handleSignIn = (e) => {
        e.preventDefault();
        
        setIsRightPanelActive(false);
    }

    useEffect(() => {
        const navigate = useNavigate();
        navigate('/chat');
    }, []);
    
    return (
        <div className={classNames} id="container">
            <Login/>
            <Register/>
            <div className="overlay-container">
                <div className="overlay">
                <div className="overlay-panel overlay-left">
                    <h1>Welcome Back!</h1>
                    <p>To keep connected with us please login with your personal info</p>
                    <button className="ghost" id="signIn" onClick={handleSignIn}>Sign In</button>
                </div>
                <div className="overlay-panel overlay-right">
                    <h1>Hello, Friend!</h1>
                    <p>Enter your personal details and start journey with us</p>
                    <button className="ghost" id="signUp" onClick={handleSignUp}>Sign Up</button>
                </div>
                </div>
            </div>
        </div>
    );
};

export default LoginRegister;
