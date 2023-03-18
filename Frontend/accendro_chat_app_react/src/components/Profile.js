import React from "react";
import { useSelector } from "react-redux";

const Profile = () => {
  const { userInfo: userInfo, isLoggedIn: isLoggedIn, jwt_web_token: jwt_web_token} = useSelector((state) => state.UserServiceReducer);

  return (
    <div className="container">
      <header className="jumbotron">
        <h3>
          <strong>{userInfo.username}</strong> Profile
        </h3>
      </header>
      <p>
        <strong>Id:</strong> {userInfo.id}
      </p>
      <p>
        <strong>Email:</strong> {userInfo.email}
      </p>
      <strong>Authorities:</strong>
      <ul>
        {userInfo.roles &&
          userInfo.roles.map((role, index) => <li key={index}>{role}</li>)}
      </ul>
    </div>
  );
};

export default Profile;
