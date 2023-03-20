package com.tanuj.WebSocketChatService.controller;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.mockito.Mockito.when;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tanuj.WebSocketChatService.model.ChatConversation;
import com.tanuj.WebSocketChatService.model.Message;
import com.tanuj.WebSocketChatService.repository.ChatConversationRepository;
import com.tanuj.WebSocketChatService.repository.MessageRepository;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.junit4.SpringRunner;

import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertEquals;

import java.util.List;
import java.util.Optional;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class WebSocketChatControllerIntegrationTest {

    @Autowired
    private TestRestTemplate restTemplate;

    @MockBean
    private MessageRepository messageRepository;

    @MockBean
    private ChatConversationRepository chatConversationRepository;

    @LocalServerPort
    private int port;

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
        List<Message> mesages = List.of(message1);

        
        ChatConversation conversation= ChatConversation.builder().conversationId("12")
                                .recieverId(recieverId)
                                .senderId(senderId)
                                .build();
        when(chatConversationRepository.findBySenderIdAndRecieverId(senderId, recieverId)).thenReturn(Optional.of(conversation));

        when(messageRepository.findByConversationId(conversation.getConversationId())).thenReturn(mesages);
        
        ResponseEntity<?> responseEntity = restTemplate.getForEntity("http://localhost:" + port + "/chatApp/" + senderId + "/" + recieverId + "/getMessages", Object.class);
        
        assertThat(responseEntity.getStatusCode(), is(HttpStatus.OK));

        ObjectMapper objectMapper = new ObjectMapper();
        List<Message> messagesReturned = objectMapper.convertValue(responseEntity.getBody(), new TypeReference<List<Message>>(){});
        assertEquals((messagesReturned), mesages);

    }

}

