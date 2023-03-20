package com.tanuj.UserService.controllers;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.tanuj.UserService.model.Users;
import com.tanuj.UserService.model.DTO.MessageDTO;
import com.tanuj.UserService.model.DTO.SignUpDTO;
import com.tanuj.UserService.repository.UsersRepository;
import com.tanuj.UserService.services.AuthenticationService;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.web.servlet.MockMvc;
import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertEquals;

@RunWith(MockitoJUnitRunner.class)
public class AuthenticationControllerUnitTest {
    

    @Mock
    private UsersRepository userRepository;

    @Mock
    private AuthenticationService authenticationService;

    @InjectMocks
    private AuthenticationController authenticationController;

    @Autowired
    private MockMvc mockMvc;

    @Test
    public void signUpUserTest_newuser() throws Exception {


        SignUpDTO signUpDTO = new SignUpDTO();
        signUpDTO.setUsername("Tanuj");
        signUpDTO.setEmail("Tanuj@gmail.com");
        signUpDTO.setPassword("test_password");
        
        when(userRepository.existsByUsername(signUpDTO.getUsername())).thenReturn(false);
        when(userRepository.existsByEmail(signUpDTO.getEmail())).thenReturn(false);

        when(authenticationService.signUpUser(signUpDTO)).thenReturn(new Users());
        
        ResponseEntity<?> responseEntity = authenticationController.signUpUser(signUpDTO);
        
        assertThat(responseEntity.getStatusCode(), is(HttpStatus.OK));
        assertEquals((MessageDTO)responseEntity.getBody(), new MessageDTO("User registered successfully!"));

        verify(userRepository, times(1)).existsByUsername(signUpDTO.getUsername());
        verify(userRepository, times(1)).existsByEmail(signUpDTO.getEmail());
        verify(authenticationService, times(1)).signUpUser(signUpDTO);

    }

    @Test
    public void signUpUserTest_useremailexists() throws Exception {


        SignUpDTO signUpDTO = new SignUpDTO();
        signUpDTO.setUsername("Tanuj");
        signUpDTO.setEmail("Tanuj@gmail.com");
        signUpDTO.setPassword("test_password");
        
        when(userRepository.existsByUsername(signUpDTO.getUsername())).thenReturn(false);
        when(userRepository.existsByEmail(signUpDTO.getEmail())).thenReturn(true);
        
        ResponseEntity<?> responseEntity = authenticationController.signUpUser(signUpDTO);
        
        assertThat(responseEntity.getStatusCode(), is(HttpStatus.BAD_REQUEST));
        assertEquals((MessageDTO)responseEntity.getBody(), (new MessageDTO("Error: Email is already in use!")));

        verify(userRepository, times(1)).existsByUsername(signUpDTO.getUsername());
        verify(userRepository, times(1)).existsByEmail(signUpDTO.getEmail());

    }

}
