import React, { useEffect, useState } from "react";
import { Button, message } from "antd";
import ScrollToBottom from "react-scroll-to-bottom";
import "../css/Chat.css";
import {get_messages_api_call} from "../Utils/ChatServiveApiUtils"
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import LoadingOverlay from 'react-loading-overlay';

import {logOutAction} from "../actions/UserServiceActions"

import {get_users_api_call} from "../Utils/UserServiceApiUtils";
import {count_new_messgaes_api_call} from "../Utils/ChatServiveApiUtils";
import {create_connection_to_stomp_server} from "../Utils/ChatServiveApiUtils";
import {send_message_to_stomp_server} from "../Utils/ChatServiveApiUtils";

import Profile from "./Profile";

var stompClient = null;
const Chat = () => {

  const { isLoggedIn: isLoggedIn } = useSelector((state) => state.UserServiceReducer);

  const {userInfo: userInfo } = useSelector(state => state.UserServiceReducer);

  const [get_users_api_message, setGet_users_api_message] = useState("");
  const [all_users, setAll_users] = useState([]);
  const [text, setText] = useState("");
  const [activeContact, setActiveContact] = useState({id:-1, username:""});
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");

  const [showProfile, setShowProfile] = useState(false);

  const [profileContact, setProfileContact] = useState({id:-1, username:""});

  const dispatch = useDispatch();

  const onMessageReceived = (msg) => {
    const notification = JSON.parse(msg.body);
    const activeContact_ss = JSON.parse(sessionStorage.getItem("activeContact"));
    const messages_ss = JSON.parse(sessionStorage.getItem("messages"));
    const all_users_ss = JSON.parse(sessionStorage.getItem("all_users"));

    if (notification && activeContact_ss.id == notification.senderId) {
      const newMessages = [...messages_ss];
      newMessages.push(notification.messageString);
      setMessages(newMessages);
    } else {
      message.info("Received a new message from " + notification.senderId);

      const updatedAllUsers = all_users_ss.map((user) => {
        if(activeContact && user.id == activeContact.id){
          return { ...user, newMessages: user.newMessages + 1 };
        } else {
          return user;
        }
      })
      setAll_users(updatedAllUsers);
    }
  };

  const get_users = (currentUser) => {

    return get_users_api_call(currentUser.id).then(
      (usersListResponse) => {
  
        usersListResponse.map((user) => {
          count_new_messgaes_api_call(user.id, currentUser.id).then((count) => {
            user.newMessages = count;
            return user;
          })
        })
        //id, username, email, roles, newMessages
        setAll_users(usersListResponse);
        if(usersListResponse.length > 0){
          setActiveContact(usersListResponse[0]);
        }
  
        return Promise.resolve();
      },
      (error) => {
        const message =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
          setGet_users_api_message(message);
  
        return Promise.reject();
      }
    );
  };
  
  const onConnected = () => {
    stompClient.subscribe(
      "/user_messages_topic/" + userInfo.id + "/chatMessageQueue",
      onMessageReceived
    );
  };

  const onError = (err) => {
    console.log(err);
  };

  const connect = () => {
    stompClient = create_connection_to_stomp_server();
    stompClient && stompClient.connect({}, onConnected, onError);
  };

  const navigate = useNavigate();
  useEffect(() => {
    if(!isLoggedIn){
      navigate('/login_register');
    }
    else{
      connect();
      get_users(userInfo);
    }
  }, []);

  const logoutUtil = () => (dispatch) => {

    dispatch(logOutAction());
    return Promise.resolve();

  };

  const handleLogout = (e) => {
    e.preventDefault();

    setLoading(true);
    setLoadingMessage("Logging Out");

    dispatch(logoutUtil())
      .then(() => {
        setLoading(false);
        setLoadingMessage("");
        navigate('/login_register');
      })
      .catch(() => {
        setLoading(false);
        setLoadingMessage("");
      });
    
  };

  useEffect(() => {

    if (activeContact === undefined) return;
    sessionStorage.setItem("activeContact", JSON.stringify(activeContact));

    if (activeContact === null) return;
    get_messages_api_call(activeContact.id, userInfo.id).then((msgs) =>{
      setMessages(msgs)
    });
    const updatedAllUsers = all_users.map((user) => {
      if(activeContact && user.id == activeContact.id){
        return { ...user, newMessages: 0 };
      } else {
        return user;
      }
    })
    setAll_users(updatedAllUsers);
  }, [activeContact]);

  useEffect(() => {
    sessionStorage.setItem("all_users", JSON.stringify(all_users));
  }, [all_users]);

  useEffect(() => {
    sessionStorage.setItem("messages", JSON.stringify(messages));
  }, [messages]);

  const sendMessage = (msg) => {
    if (msg.trim() !== "") {
      const message = {
        senderId: userInfo.id,
        recieverId: activeContact.id,
        messageString: msg,
        timestamp: new Date(),
      };
      send_message_to_stomp_server(message);

      const newMessages = [...messages];
      newMessages.push(message);
      setMessages(newMessages);
    }
  };

  return (
    <div id="frame">
      <div id="sidepanel">
        <div id="profile">
          <div className="wrap">
            {/* <img
              id="profile-img"
              src={userInfo.profilePicture}
              className="online"
              alt=""
            /> */}
            <p>{userInfo===null ? "test_user" : userInfo.username}</p>
            <div id="status-options">
              {/* <ul>
                <li id="status-online" className="active">
                  <span className="status-circle"></span> <p>Online</p>
                </li>
                <li id="status-away">
                  <span className="status-circle"></span> <p>Away</p>
                </li>
                <li id="status-busy">
                  <span className="status-circle"></span> <p>Busy</p>
                </li>
                <li id="status-offline">
                  <span className="status-circle"></span> <p>Offline</p>
                </li>
              </ul> */}
            </div>
          </div>
        </div>
        <div id="search" />
        <div id="contacts" data-testid="contacts">
          <ul>
            {(all_users == null ? [] : all_users).map((contact) => (
              <li
                key = {contact.id}
                onClick={() => {setActiveContact(contact); setShowProfile(false);}}
                className={
                  activeContact && contact.id == activeContact.id
                    ? "contact active"
                    : "contact"
                }
              >
                <div className="wrap">
                  {/* <span className="contact-status online"></span> */}
                  {/* <img id={contact.id} src={contact.profilePicture} alt="" /> */}
                  <div className="meta">
                    <p className="name">{contact.username}</p>
                    {contact.newMessages !== undefined &&
                      contact.newMessages > 0 && (
                        <p className="preview">
                          {contact.newMessages} new messages
                        </p>
                      )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div id="bottom-bar">
          <button id="addcontact" onClick={() => {
                setActiveContact(null);
                setProfileContact(null);
                setShowProfile(true);
              }}>
            <i className="fa fa-user fa-fw" aria-hidden="true"></i>{" "}
            <span>Profile</span>
          </button>
          <button id="Log Out" onClick={handleLogout}>
            <i className="fa fa-cog fa-fw" aria-hidden="true"></i>{" "}
            <span>Log Out</span>
          </button>
        </div>
      </div>
      <div className="content">
        <div className="contact-profile">
          {/* <img src={activeContact && activeContact.profilePicture} alt="" /> */}
          <p>{!showProfile && activeContact.id!==-1 && activeContact.username}</p>
          {
            (!showProfile && activeContact.id!==-1) 
            && 
            <button id="addcontact" onClick={() => {
              setProfileContact(activeContact);
              setShowProfile(true);
            }}>
              <span>Profile</span>
            </button>
          }
        </div>
        {
        (showProfile) ? 
          <Profile userInfo = {profileContact ? profileContact : userInfo}/> 
            :
          <div>
            <ScrollToBottom className="messages">
              <ul>
                {(messages == null ? [] : messages).map((msg, index) => (
                  <li 
                  key = {index}
                  className={msg.senderId == userInfo.id ? "sent" : "replies"}>
                    {msg.senderId != userInfo.id && (
                      <img src={activeContact.profilePicture} alt="" />
                    )}
                    <p>{msg.messageString}</p>
                  </li>
                ))}
              </ul> 
            </ScrollToBottom>
            <div className="message-input">
              <div className="wrap">
                <input
                  name="user_input"
                  size="large"
                  placeholder="Write your message..."
                  value={text}
                  onChange={(event) => setText(event.target.value)}
                  onKeyPress={(event) => {
                    if (event.key === "Enter") {
                      sendMessage(text);
                      setText("");
                    }
                  }}
                />

                <Button
                  data-testid="send-message-button"
                  icon={<i className="fa fa-paper-plane" aria-hidden="true"></i>}
                  onClick={() => {
                    sendMessage(text);
                    setText("");
                  }}
                />
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  );
};

export default Chat;
