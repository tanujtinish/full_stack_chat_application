package com.tanuj.UserService.controllers;

import java.util.List;
import java.util.stream.Collectors;

import com.tanuj.UserService.model.Users;
import com.tanuj.UserService.model.DTO.LoginDTO;
import com.tanuj.UserService.model.DTO.MessageDTO;
import com.tanuj.UserService.model.DTO.SignUpDTO;
import com.tanuj.UserService.model.DTO.UserInfoDTO;
import com.tanuj.UserService.repository.RolesRepositoey;
import com.tanuj.UserService.repository.UsersRepository;
import com.tanuj.UserService.services.AuthenticationService;
import com.tanuj.UserService.services.JWTService;
import com.tanuj.UserService.services.UserDetailsImpl;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/chat/security")
public class AuthenticationController {

    private static final Logger LOGGER = LoggerFactory.getLogger(AuthenticationController.class);

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UsersRepository userRepository;

    @Autowired
    RolesRepositoey roleRepository;

    @Autowired
    AuthenticationService authenticationService;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JWTService jwtService;

    @PostMapping("/log_in")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginDTO loginDto) {

        try{
            UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(loginDto.getUsername(), loginDto.getPassword());
            
            Authentication authentication = authenticationManager.authenticate(token);

            SecurityContextHolder.getContext().setAuthentication(authentication);

            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

            ResponseCookie jwtCookie = jwtService.createCookieWithTokenFromUsername(userDetails);

            List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());


            UserInfoDTO userInfoDTO = UserInfoDTO.builder()
                .id(userDetails.getId())
                .username(userDetails.getUsername())
                .email(userDetails.getEmail())
                .roles(roles)
                .build();
            
            return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, jwtCookie.toString())
                .body(userInfoDTO);
        }
        catch(Exception e){
            LOGGER.error("Error in controller authenticateUser is: "+e);
            e.printStackTrace();

            return ResponseEntity.badRequest().body(new MessageDTO("Error in controller authenticateUser is: "+e));
        }
    }

    @PostMapping("/sign_up")
    public ResponseEntity<?> signUpUser(@Valid @RequestBody SignUpDTO singUpDto) {

        try{
            if (userRepository.existsByUsername(singUpDto.getUsername())) {
                return ResponseEntity.badRequest().body(new MessageDTO("Error: Username is already taken!"));
            }

            if (userRepository.existsByEmail(singUpDto.getEmail())) {
                return ResponseEntity.badRequest().body(new MessageDTO("Error: Email is already in use!"));
            }

            Users user = authenticationService.signUpUser(singUpDto);

            return ResponseEntity.ok(new MessageDTO("User registered successfully!"));
        }
        catch(Exception e){
            LOGGER.error("Error in controller signUpUser is: "+e);
            e.printStackTrace();

            return ResponseEntity.badRequest().body(new MessageDTO("Error in controller signUpUser is: "+e));
        }
    }

    @PostMapping("/log_out")
    public ResponseEntity<?> logoutUser() {
        
        try{
            ResponseCookie cookie = jwtService.createCookieWithNullToken();

            return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(new MessageDTO("You've been signed out!"));
        
        }
        catch(Exception e){
            LOGGER.error("Error in controller logoutUser is: "+e);
            e.printStackTrace();

            return ResponseEntity.badRequest().body(new MessageDTO("Error in controller logoutUser is: "+e));
        }
    }
}