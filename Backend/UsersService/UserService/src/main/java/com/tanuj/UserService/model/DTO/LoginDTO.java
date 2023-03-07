package com.tanuj.UserService.model.DTO;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginDTO {

    @NotBlank
    @Size(min = 6, max = 50)
	private String username;

	@NotBlank
    @Size(min =8, max = 64)
	private String password;
    
}
