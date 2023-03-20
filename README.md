# full_stack_chat_application
One to one Chat application built using React Js and Spring Boot


# How to run all the services?
Steps:
1. Clone this repository
2. Go to root folder full_stack_chat_application
3. To start all services in one go, run following command:
    docker-compose -f docker-compose.yml up -d

4. To start individual services, run following command:
    3.1 Backend service 1 aka WebSocketChatService: 
    docker-compose -f ./Backend/WebSocketChatService/WebSocketChatService/Docker/docker-compose.yml up -d

    3.2 Backend service 2 aka UserService: 
    docker-compose -f ./Backend/UsersService/UserService/Docker/docker-compose.yml up -d

    3.3 Frontend react service: 
    docker-compose -f ./Frontend/accendro_chat_app_react/Docker/docker-compose.yml up -d

#Features Added:
    1. Representing each stack resource as a container/image and being able to run the stack from docker-compose or some other automation.
    2. Logging and error handling
    3. Backend TESTING: Includes both Unit and integration test cases for both backend services
    4. Frontend TESTING: Includes both Unit and integration test cases for both backend services
    5. Eureka service registry

# Frontend service
    # Frontend service 1: React Web App for Chat Service
    Frontend backend application for our chat application built using React JS
    
    # To Run This Service, type:
    docker-compose -f ./Frontend/accendro_chat_app_react/Docker/docker-compose.yml up -d

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