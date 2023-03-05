package main.java.com.tanuj.WebSocketChatService.service;

import java.util.Optional;

import com.tanuj.webSocketManager.repository.ChatConversationRepository;
import com.tanuj.webSocketManager.model.ChatConversation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ChatConversationService {
    
    @Autowired 
    private ChatConversationRepository chatConversationRepository;
    

    public String createAndGetCoversationId(String senderId, String recieverId) {

        Optional<ChatConversation> conversation = ChatConversationRepository.findBySenderIdAndRecieverId(senderId, recipientId);

        if(conversation.isPresent()){
            return conversation.get();
        }
        else{
            String coversationId = senderId + "_" + recieverId;

            ChatConversation senderRecieverChat = ChatConversation
                .builder()
                .coversationId(coversationId)
                .senderId(senderId)
                .recieverId(recieverId)
                .build();
                ChatConversationRepository.save(coversationId);

            ChatConversation recieverSenderChat = ChatConversation
                .builder()
                .coversationId(coversationId)
                .senderId(recieverId)
                .recieverId(senderId)
                .build();
                ChatConversationRepository.save(recieverSenderChat);

            return coversationId;
        }

   }

    public Optional<String> getConversationId(String senderId, String recieverId) {
        

        Optional<ChatConversation> conversation = ChatConversationRepository.findBySenderIdAndRecieverId(senderId, recipientId);

        if(conversation.isPresent()){
            return conversation.get();
        }
        else{
            return  Optional.empty();
        }
    }

}
