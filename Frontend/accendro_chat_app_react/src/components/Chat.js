import React, { useEffect, useState } from "react";
import { Button, message } from "antd";
import ScrollToBottom from "react-scroll-to-bottom";
import "../css/Chat.css";
import { get_users } from "../actions/UserServiceActions";
import {get_messages_api_call} from "../Utils/ChatServiveApiUtils"
import { useDispatch, useSelector } from "react-redux";
import { Navigate  } from 'react-router-dom';

var stompClient = null;
const Chat = (props) => {

  const { isLoggedIn: isLoggedIn } = useSelector((state) => state.UserServiceReducer);

  const {all_users: contacts } = useSelector(state => state.UserServiceReducer);
  const {userInfo: userInfo } = useSelector(state => state.UserServiceReducer);

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
          <div class="wrap">
            {/* <img
              id="profile-img"
              src={userInfo.profilePicture}
              class="online"
              alt=""
            /> */}
            <p>{userInfo===null ? "test_user" : userInfo.username}</p>
            <div id="status-options">
              <ul>
                <li id="status-online" class="active">
                  <span class="status-circle"></span> <p>Online</p>
                </li>
                <li id="status-away">
                  <span class="status-circle"></span> <p>Away</p>
                </li>
                <li id="status-busy">
                  <span class="status-circle"></span> <p>Busy</p>
                </li>
                <li id="status-offline">
                  <span class="status-circle"></span> <p>Offline</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div id="search" />
        <div id="contacts">
          <ul>
            {(contacts == null ? [] : contacts).map((contact) => (
              <li
                onClick={() => setActiveContact(contact)}
                class={
                  activeContact && contact.id === activeContact.id
                    ? "contact active"
                    : "contact"
                }
              >
                <div class="wrap">
                  <span class="contact-status online"></span>
                  {/* <img id={contact.id} src={contact.profilePicture} alt="" /> */}
                  <div class="meta">
                    <p class="name">{contact.username}</p>
                    {contact.newMessages !== undefined &&
                      contact.newMessages > 0 && (
                        <p class="preview">
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
            <i class="fa fa-user fa-fw" aria-hidden="true"></i>{" "}
            <span>Profile</span>
          </button>
          <button id="settings">
            <i class="fa fa-cog fa-fw" aria-hidden="true"></i>{" "}
            <span>Settings</span>
          </button>
        </div>
      </div>
      <div class="content">
        <div class="contact-profile">
          {/* <img src={activeContact && activeContact.profilePicture} alt="" /> */}
          <p>{activeContact && activeContact.username}</p>
        </div>
        <ScrollToBottom className="messages">
          <ul>
            {(messages == null ? [] : messages).map((msg) => (
              <li class={msg.senderId === userInfo.id ? "sent" : "replies"}>
                {msg.senderId !== userInfo.id && (
                  <img src={activeContact.profilePicture} alt="" />
                )}
                <p>{msg.content}</p>
              </li>
            ))}
          </ul>
        </ScrollToBottom>
        <div class="message-input">
          <div class="wrap">
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
              icon={<i class="fa fa-paper-plane" aria-hidden="true"></i>}
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
