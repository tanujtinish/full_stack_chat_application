# User Service
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
docker-compose -f docker-compose.yml up -d