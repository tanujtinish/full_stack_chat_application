import axios from "axios";
import {CHAT_SERVICE_BASE_API_URL} from "../APIS/BaseAPIConstanats"

export function count_new_messgaes_api_call(senderId, recieverId){

    return axios.get(CHAT_SERVICE_BASE_API_URL + "/" + senderId + "/" + recieverId + "/count")
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
  
    return axios.get(CHAT_SERVICE_BASE_API_URL + "/" + senderId + "/" + recieverId + "/getMessages")
    .then((res) => {
      return res.data;
    });
  
};