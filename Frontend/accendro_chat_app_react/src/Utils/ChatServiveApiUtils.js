import axios from "axios";
import {CHAT_SERVICE_BASE_API_URL} from "../APIS/BaseAPIConstanats"

export function count_new_messgaes_api_call(senderId, recieverId){

    return axios.get(CHAT_SERVICE_BASE_API_URL + senderId + "/" + recieverId + "/count")
    .then((res) => {
      return res.data;
    });
  
};

export function get_messages_api_call(senderId, recieverId){
  // private String id;
  // private String conversationId;
  // private String messageString;
  // private Date timestamp;
  // private MessageState state;
  // private String senderId;
  // private String recieverId;
  
    return axios.get(CHAT_SERVICE_BASE_API_URL + senderId + "/" + recieverId + "/getMessages")
    .then((res) => {
      return res.data;
    });
  
};

export function create_connection_to_stomp_server(){
  
  const Stomp = require("stompjs");
  var SockJS = require("sockjs-client");
  SockJS = new SockJS("http://127.0.0.1:8080/web_socket");
  var stompClient = Stomp.over(SockJS);

  return stompClient;
}

export function send_message_to_stomp_server(message){
  
  stompClient.send("/chat_app/chatApp/send", {}, JSON.stringify(message));

}