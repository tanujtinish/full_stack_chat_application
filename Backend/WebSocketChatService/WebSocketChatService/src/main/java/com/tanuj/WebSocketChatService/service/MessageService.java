package com.tanuj.WebSocketChatService.service;

import java.util.List;
import java.util.Optional;

import com.tanuj.WebSocketChatService.repository.MessageRepository;
import com.tanuj.WebSocketChatService.model.Message;
import com.tanuj.WebSocketChatService.model.enums.MessageState;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

import com.tanuj.WebSocketChatService.model.DTO.MessageDTO;

@Service
public class MessageService {
    
    @Autowired 
    private MessageRepository messageRepository;

    @Autowired 
    private ChatConversationService chatConversationService;

    @Autowired 
    private MongoOperations mongoOperations;

    private Message messageDtoToMessage(MessageDTO messageDTO){

        String coversationId = chatConversationService.createAndGetCoversationId(messageDTO.getSenderId(), messageDTO.getRecieverId());

        messageDTO.setConversationId(coversationId);

        Message message = Message
                .builder()
                .conversationId(coversationId)
                .messageString(messageDTO.getMessageString())
                .timestamp(messageDTO.getTimestamp())
                .senderId(messageDTO.getSenderId())
                .recieverId(messageDTO.getRecieverId())
                .build();

        return message;

    }

    //Create
    public Message sendMessage(MessageDTO messageDTO) {

        Message message = messageDtoToMessage(messageDTO);

        message.setState(MessageState.SENT_UNREAD);
        messageRepository.save(message);
        return message;
    }

    //Read
    public long countUnreadMessages(String senderId, String recieverId) {

        long unreadMessages = messageRepository.countBySenderIdAndRecieverIdIdAndStatus(senderId, recieverId, MessageState.SENT_UNREAD);

        return unreadMessages;
    }

    //Update
    public void markRead(String senderId, String recieverId) {
        Criteria quetyCriteria = Criteria.where("recieverId").is(recieverId).and("senderId").is(senderId);
        Query query = new Query(quetyCriteria);

        Update update = Update.update("status", MessageState.READ);
        mongoOperations.updateMulti(query, update, Message.class);
    }

    //Read
    public List<Message> findAllConversationMessages(String senderId, String recieverId) {

        String coversationId = chatConversationService.createAndGetCoversationId(senderId, recieverId);

        List<Message> messages = messageRepository.findByConversationId(coversationId);

        markRead(senderId, recieverId);

        return messages;
    }

}
