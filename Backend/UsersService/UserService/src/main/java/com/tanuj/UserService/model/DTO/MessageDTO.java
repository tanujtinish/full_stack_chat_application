package com.tanuj.UserService.model.DTO;

import lombok.*;

@Getter
@Setter
public class MessageDTO {
    
    private String message;

    public MessageDTO(String message) {
    this.message = message;
    }

}
