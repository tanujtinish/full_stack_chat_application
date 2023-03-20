package com.tanuj.UserService.controllers;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tanuj.UserService.model.Roles;
import com.tanuj.UserService.model.DTO.MessageDTO;
import com.tanuj.UserService.model.DTO.SignUpDTO;
import com.tanuj.UserService.repository.RolesRepositoey;
import com.tanuj.UserService.repository.UsersRepository;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.junit4.SpringRunner;

import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertEquals;

import java.util.Optional;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class AuthenticationControllerIntegrationTest {

    @Autowired
    private TestRestTemplate restTemplate;

    @MockBean
    private UsersRepository userRepository;

    @MockBean
    private RolesRepositoey rolesRepositoey;

    @LocalServerPort
    private int port;

    @Before
    public void setUp() {
        SignUpDTO signUpDTO = new SignUpDTO();
        signUpDTO.setUsername("Tanuj");
        signUpDTO.setEmail("Tanuj@gmail.com");
        signUpDTO.setPassword("test_password");
    }

    @Test
    public void signUpUserTest_newuser() throws Exception {

        SignUpDTO signUpDTO = new SignUpDTO();
        signUpDTO.setUsername("Tanuj");
        signUpDTO.setEmail("Tanuj@gmail.com");
        signUpDTO.setPassword("test_password");

        when(userRepository.existsByUsername(signUpDTO.getUsername())).thenReturn(false);
        when(userRepository.existsByEmail(signUpDTO.getEmail())).thenReturn(false);

        Roles adminRole = new Roles();
        adminRole.setName("ROLE_ADMIN");
        when(rolesRepositoey.findByName("ROLE_ADMIN")).thenReturn(Optional.of(adminRole));

        Roles modRole = new Roles();
        adminRole.setName("ROLE_MODERATOR");
        when(rolesRepositoey.findByName("ROLE_MODERATOR")).thenReturn(Optional.of(modRole));

        Roles userRole = new Roles();
        adminRole.setName("ROLE_USER");
        when(rolesRepositoey.findByName("ROLE_USER")).thenReturn(Optional.of(userRole));

        when(userRepository.save(any())).thenReturn(null);
        
        ResponseEntity<?> responseEntity = restTemplate.postForEntity("http://localhost:" + port + "/chat/security/sign_up", signUpDTO, Object.class);
        
        assertThat(responseEntity.getStatusCode(), is(HttpStatus.OK));

        ObjectMapper objectMapper = new ObjectMapper();
        MessageDTO messageDTO = objectMapper.convertValue(responseEntity.getBody(), MessageDTO.class);
        assertEquals((messageDTO), new MessageDTO("User registered successfully!"));

    }

}

