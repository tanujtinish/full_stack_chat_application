package com.tanuj.WebSocketChatService.repository;

import com.tanuj.WebSocketChatService.model.Message;
import com.tanuj.WebSocketChatService.model.enums.MessageState;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface MessageRepository
        extends MongoRepository<Message, String> {

    long countBySenderIdAndRecieverIdAndState(
            String senderId, String recipientId, MessageState state);

    List<Message> findByConversationId(String conversationId);
}
