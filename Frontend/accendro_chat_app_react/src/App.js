import React from "react";
import { Routes, Route } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import LoginRegister from "./components/LoginRegister";
import Profile from "./components/Profile";
import Header from "./components/Header";

const App = () => {
  

  return (
    <div>

      {/* <Header/> */}

      <div className="container mt-3">
        <Routes>
          <Route path="/" element={<LoginRegister />} />
          <Route path="/login_register" element={<LoginRegister />} />
          <Route path="/profile" element={<Profile />} />
          
        </Routes>
      </div>

      {/* <AuthVerify logOut={logOut}/> */}
    </div>
  );
};

export default App;
