package com.tanuj.WebSocketChatService.service;

import java.util.Optional;

import com.tanuj.WebSocketChatService.repository.ChatConversationRepository;
import com.tanuj.WebSocketChatService.model.ChatConversation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ChatConversationService {
    
    @Autowired 
    private ChatConversationRepository chatConversationRepository;
    

    public String createAndGetCoversationId(String senderId, String recieverId) {

        Optional<ChatConversation> conversation = chatConversationRepository.findBySenderIdAndRecieverId(senderId, recieverId);

        if(conversation.isPresent()){
            return conversation.get().getConversationId();
        }
        else{
            String conversationId = senderId + "_" + recieverId;

            ChatConversation senderRecieverChat = ChatConversation
                .builder()
                .conversationId(conversationId)
                .senderId(senderId)
                .recieverId(recieverId)
                .build();
            chatConversationRepository.save(senderRecieverChat);

            ChatConversation recieverSenderChat = ChatConversation
                .builder()
                .conversationId(conversationId)
                .senderId(recieverId)
                .recieverId(senderId)
                .build();
            chatConversationRepository.save(recieverSenderChat);

            return conversationId;
        }

   }

}
