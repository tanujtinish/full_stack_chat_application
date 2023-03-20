package com.tanuj.WebSocketChatService.controller;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;

import com.tanuj.WebSocketChatService.model.Message;
import com.tanuj.WebSocketChatService.service.MessageService;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertEquals;

@RunWith(MockitoJUnitRunner.class)
public class WebSocketChatControllerUnitTest {
    

    @Mock
    private MessageService messageService;

    @InjectMocks
    private WebSocketChatController webSocketChatController;

    @Test
    public void findChatMessagesTest() throws Exception {

        String senderId ="1";
        String recieverId ="2";

        Message message1 = Message.builder()
                            .conversationId("1")
                            .messageString("Hi, how are you")
                            .senderId(senderId)
                            .recieverId(recieverId)
                            .build();

        List<Message> x = List.of(message1);
        when(messageService.findAllConversationMessages(senderId, recieverId)).thenReturn(x);
        
        ResponseEntity<?> responseEntity = webSocketChatController.findChatMessages(senderId, recieverId);
        
        assertThat(responseEntity.getStatusCode(), is(HttpStatus.OK));
        assertEquals((List<Message>)responseEntity.getBody(), x);

        verify(messageService, times(1)).findAllConversationMessages(senderId, recieverId);

    }
}

