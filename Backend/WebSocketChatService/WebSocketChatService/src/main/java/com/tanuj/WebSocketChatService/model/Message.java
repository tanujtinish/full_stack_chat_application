package com.tanuj.webSocketChatService.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;

import com.tanuj.webSocketChatService.model.enums.MessageState;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Document
public class Message {
   @Id
   private String id;
   private String conversationId;
   private String messageString;
   private Date timestamp;
   private MessageState state;
}
