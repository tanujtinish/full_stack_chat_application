import React from "react";
import { Routes, Route } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import LoginRegister from "./components/LoginRegister";
import Profile from "./components/Profile";
import Header from "./components/Header";
import Chat from "./components/Chat";

const App = () => {
  

  return (
    <div>
        <Routes>
          <Route path="/" element={<Chat/>} />
          <Route path="/login_register" element={<LoginRegister />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/chat" element={<Chat/>} />
        </Routes>
    </div>
  );
};

export default App;
