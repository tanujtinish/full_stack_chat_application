package com.tanuj.webSocketManager.repository;

import com.tanuj.webSocketManager.model.Message;
import com.tanuj.webSocketManager.model.enums.MessageState;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface MessageRepository
        extends MongoRepository<Message, String> {

    long countBySenderIdAndRecieverIdIdAndStatus(
            String senderId, String recipientId, MessageState status);

    List<Message> findByConversationId(String conversationId);
}
