package main.java.com.tanuj.WebSocketChatService.service;

import java.util.Optional;

import com.tanuj.webSocketManager.repository.MessageRepository;
import com.tanuj.webSocketManager.model.Message;
import com.tanuj.webSocketManager.model.enums.MessageState;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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

        messageDTO.setChatId(chatId.get());

        Message message = ChatConversation
                .builder()
                .coversationId(coversationId)
                .messageString(MessageDTO.getMessageString())
                .timestamp(MessageDTO.getTimestamp())
                .build();

        return message;

    }

    //Create
    public Message sendMessage(MessageDTO messageDTO) {

        Message message = messageDtoToMessage(messageDTO);

        message.setStatus(MessageState.SENT_UNREAD);
        repository.save(message);
        return message;
    }

    //Read
    public long countUnreadMessages(String senderId, String recieverId) {

        long unreadMessages = messageRepository.countBySenderIdAndRecieverIdIdAndStatus(senderId, recieverId, MessageState.RECEIVED);

        return unreadMessages;
    }

    //Read
    public List<Message> findAllConversationMessages(String senderId, String recieverId) {

        String coversationId = chatConversationService.createAndGetCoversationId(senderId, recieverId);

        List<Message> messages = messageRepository.findByConversationId(coversationId);

        markRead(senderId, recieverId, MessageState.READ);

        return messages;
    }

    //Update
    public void markRead(String senderId, String recieverId) {
        Criteria quetyCriteria = Criteria.where("recieverId").is(recieverId).and("senderId").is(senderId);
        Query query = new Query(quetyCriteria);

        Update update = Update.update("status", MessageState.READ);
        mongoOperations.updateMulti(query, update, Message.class);
    }

}
