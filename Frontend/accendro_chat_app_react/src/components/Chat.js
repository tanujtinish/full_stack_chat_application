import React, { useEffect, useState } from "react";
import { Button, message } from "antd";
import ScrollToBottom from "react-scroll-to-bottom";
import "../css/Chat.css";
import { get_users } from "../actions/UserServiceActions";
import {get_messages_api_call} from "../Utils/ChatServiveApiUtils"
import { useDispatch, useSelector } from "react-redux";
import { Navigate  } from 'react-router-dom';

import {get_users_api_call} from "../Utils/UserServiceApiUtils";
import {count_new_messgaes_api_call} from "../Utils/ChatServiveApiUtils";

var stompClient = null;
const Chat = (props) => {

  const { isLoggedIn: isLoggedIn } = useSelector((state) => state.UserServiceReducer);

  const {userInfo: userInfo } = useSelector(state => state.UserServiceReducer);

  const [get_users_api_message, setGet_users_api_message] = useState("");
  const [all_users, setAll_users] = useState([]);
  const [text, setText] = useState("");
  const [activeContact, setActiveContact] = useState();
  const [messages, setMessages] = useState();

  const onMessageReceived = (msg) => {
    const notification = JSON.parse(msg.body);

    if (activeContact.id === notification.senderId) {
      const newMessages = [...messages];
      newMessages.push(notification.messageString);
      setMessages(newMessages);
    } else {
      message.info("Received a new message from " + notification.senderId);
      get_users(userInfo);
    }
  };

  const get_users = (currentUser) => (dispatch) => {

    return get_users_api_call().then(
      (usersListResponse) => {
  
        usersListResponse.map((user) => {
          count_new_messgaes_api_call(user.id, currentUser.id).then((count) => {
            user.newMessages = count;
            return user;
          })
        })
        //id, username, email, roles, newMessages
        setAll_users(usersListResponse);
  
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
    const Stomp = require("stompjs");
    var SockJS = require("sockjs-client");
    SockJS = new SockJS("http://127.0.0.1:8080/web_socket");
    stompClient = Stomp.over(SockJS);
    stompClient.connect({}, onConnected, onError);
  };

  useEffect(() => {
    connect();
    get_users(userInfo);
  }, []);

  useEffect(() => {
    if (activeContact === undefined) return;
    get_messages_api_call(activeContact.id, userInfo.id).then((msgs) =>
      setMessages(msgs)
    );
    get_users(userInfo);
  }, [activeContact]);

  const sendMessage = (msg) => {
    if (msg.trim() !== "") {
      const message = {
        senderId: userInfo.id,
        recipientId: activeContact.id,
        messageString: msg,
        timestamp: new Date(),
      };
      stompClient.send("/chat_app/chatApp/send", {}, JSON.stringify(message));

      const newMessages = [...messages];
      newMessages.push(message);
      setMessages(newMessages);
    }
  };

  // if (!isLoggedIn) {
  //   return <Navigate to="/login_register" />;
  // }

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
              <ul>
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
              </ul>
            </div>
          </div>
        </div>
        <div id="search" />
        <div id="contacts">
          <ul>
            {(all_users == null ? [] : all_users).map((contact) => (
              <li
                key = {contact.id}
                onClick={() => setActiveContact(contact)}
                className={
                  activeContact && contact.id === activeContact.id
                    ? "contact active"
                    : "contact"
                }
              >
                <div className="wrap">
                  <span className="contact-status online"></span>
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
          <button id="addcontact">
            <i className="fa fa-user fa-fw" aria-hidden="true"></i>{" "}
            <span>Profile</span>
          </button>
          <button id="settings">
            <i className="fa fa-cog fa-fw" aria-hidden="true"></i>{" "}
            <span>Settings</span>
          </button>
        </div>
      </div>
      <div className="content">
        <div className="contact-profile">
          {/* <img src={activeContact && activeContact.profilePicture} alt="" /> */}
          <p>{activeContact && activeContact.username}</p>
        </div>
        <ScrollToBottom className="messages">
          <ul>
            {(messages == null ? [] : messages).map((msg) => (
              <li className={msg.senderId === userInfo.id ? "sent" : "replies"}>
                {msg.senderId !== userInfo.id && (
                  <img src={activeContact.profilePicture} alt="" />
                )}
                <p>{msg.content}</p>
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
              icon={<i className="fa fa-paper-plane" aria-hidden="true"></i>}
              onClick={() => {
                sendMessage(text);
                setText("");
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
