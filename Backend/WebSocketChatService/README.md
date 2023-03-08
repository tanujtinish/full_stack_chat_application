# Web Socket Service
Authentication service for our backend application built using Spring Boot

# APIs:
http://127.0.0.1:8080/

    POST /chatApp/send
    {
        conversationId;
        messageString,
        private Date timestamp,
        private MessageState state,
        senderId,
        recieverId
    }
    

    GET /chatApp/{senderId}/{recieverId}/count
    {
        email,
        password,
        roles
    }

    GET /chatApp/{senderId}/{recieverId}/getMessages
    {
        email,
        password,
        roles
    }


# To Run This Service, type:
docker-compose -f docker-compose.yml up -d