import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

const decodeJwtBase64Encoding = (token) => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    return null;
  }
};

const logOutOnExpiry = (props) => {
  let location = useLocation();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    if (userInfo) {
      const decodedJwt = parseJwt(userInfo.accessToken);

      if (decodedJwt.exp * 1000 < Date.now()) {
        props.logOut();
      }
    }
  }, [location, props]);

  return <div></div>;
};

export default AuthVerify;
