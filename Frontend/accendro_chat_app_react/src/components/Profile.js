import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import "../css/Profile.css";

const Profile = (props) => {
  const { userInfo: userInfo, isLoggedIn: isLoggedIn, jwt_web_token: jwt_web_token} = useSelector((state) => state.UserServiceReducer);

  useEffect(() => {
    if(props===null || props===undefined){
      props = userInfo;
    }
  }, []);

  const uppercase = word => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  };

  return (
    
    <div className="card">
      <div className="card-body">
        <div className="avatar">
          <img
            src="../logo.svg"
            className="card-img-top"
            alt=""
          />
        </div>
        <h5 className="card-title">
          {uppercase(props.userInfo.username)}
        </h5>
          <p className="card-text">
          <strong>Email:</strong> {props.userInfo.email}
          <p></p>
          <strong>Authorities:</strong>
          <ul>
            {props.userInfo.roles &&
              props.userInfo.roles.map((role, index) => <li key={index}>{role}</li>)}
          </ul>
        </p>
      </div>
    </div>
    
  );
};

export default Profile;
