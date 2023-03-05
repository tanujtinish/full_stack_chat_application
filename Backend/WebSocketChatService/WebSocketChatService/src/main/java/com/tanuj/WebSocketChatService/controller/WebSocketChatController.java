package main.java.com.tanuj.WebSocketChatService.controller;


import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import com.tanuj.webSocketManager.service.ChatConversationService;
import com.tanuj.webSocketManager.service.MessageService;

import com.tanuj.webSocketManager.model.Message;

public class WebSocketChatController {
    
    
    @Autowired 
    private ChatConversationService chatConversationService;

    @Autowired 
    private MessageService messageService;

    @Autowired 
    private SimpMessagingTemplate simpMessagingTemplate;

    @MessageMapping("/chatApp/send")
    public void sendMessage(@Payload MessageDTO messageDTO) {
        
        Message messageSent = messageService.sendMessage(messageDTO);
        MessageDTO.setTimestamp(MessageDTO.getTimestamp());

        simpMessagingTemplate.convertAndSendToUser(
            message.getRecieverId(),
            "/chatMessageQueue",
            MessageDTO);
    }

    @GetMapping("/chatApp/{senderId}/{recieverId}/count")
    public ResponseEntity<Long> countUnreadMessages(
            @PathVariable String senderId,
            @PathVariable String recieverId) {
        

            Long unreadMessagesCount = messageService.countUnreadMessages(senderId, recieverId);
            return ResponseEntity.ok(unreadMessagesCount);
    }

    @GetMapping("/chatApp/{senderId}/{recieverId}/getMessages")
    public ResponseEntity<List<Message>> findChatMessages ( 
        @PathVariable String senderId,
        @PathVariable String recieverId) {
        
            List<Message> messages = messageService.findAllConversationMessages(senderId, recieverId);
            return ResponseEntity.ok(messages);
    }

}
