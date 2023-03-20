import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "../css/Profile.css";

const Profile = (props) => {
  const { userInfo: userInfo, isLoggedIn: isLoggedIn, jwt_web_token: jwt_web_token} = useSelector((state) => state.UserServiceReducer);

  const [userProfile, setProfile] = useState(props);
  useEffect(() => {
    if(userProfile===null || userProfile===undefined){
      setProfile({id:-1, username:""});
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
          {uppercase(userProfile.userInfo.username)}
        </h5>
        <div className="card-text">
          <p>
            <strong>Email:</strong> {userProfile.userInfo.email}
          </p>
          <p></p>
          <p>
            <strong>Authorities:</strong>
          </p>
          <ul>
            {userProfile.userInfo.roles &&
              userProfile.userInfo.roles.map((role, index) => <li key={index}>{role}</li>)}
          </ul>
        </div>
      </div>
    </div>
    
  );
};

export default Profile;
