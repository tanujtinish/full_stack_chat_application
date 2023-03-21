package com.tanuj.WebSocketChatService.service;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.RequestMapping;

@FeignClient("chat-app-user-service")
public interface UserServiceFeignClient {

    @RequestMapping("/chat/user/users/{userId}")
    String findAll();

}
