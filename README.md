# full_stack_chat_application
One to one Chat application built using React Js and Spring Boot


# How to run all the services?
Steps:
1. Clone this repository
2. Go to root folder full_stack_chat_application
3. To start services run:
    3.1 docker-compose -f ./Backend/WebSocketChatService/WebSocketChatService/Docker/docker-compose.yml up -d
    3.2 docker-compose -f ./Backend/UsersService/UserService/Docker/docker-compose.yml up -d
    3.3 

# Backend services
    # Backend service 1: Web Socket Service
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
       docker-compose -f ./Backend/WebSocketChatService/WebSocketChatService/Docker/docker-compose.yml up -d

        
    # Backend service 2: User Service
        Authentication service for our backend application built using Spring Boot

        # APIs:
        http://127.0.0.1:8081/

            POST /chat/security/log_in
            {
                usename,
                password
            }
            

            POST /chat/security/sign_up
            {
                email,
                password,
                roles
            }

            POST /chat/security/log_out
            {
                email,
                password,
                roles
            }


        # To Run This Service, type:
        docker-compose -f ./Backend/UsersService/UserService/Docker/docker-compose.yml up -d