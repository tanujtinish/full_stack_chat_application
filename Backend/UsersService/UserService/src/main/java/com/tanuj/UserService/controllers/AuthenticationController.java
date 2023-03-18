package com.tanuj.UserService.controllers;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import com.tanuj.UserService.model.Roles;
import com.tanuj.UserService.model.Users;
import com.tanuj.UserService.model.DTO.LoginDTO;
import com.tanuj.UserService.model.DTO.MessageDTO;
import com.tanuj.UserService.model.DTO.SignUpDTO;
import com.tanuj.UserService.model.DTO.UserInfoDTO;
import com.tanuj.UserService.repository.RolesRepositoey;
import com.tanuj.UserService.repository.UsersRepository;
import com.tanuj.UserService.services.JWTService;
import com.tanuj.UserService.services.UserDetailsImpl;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
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
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/chat/security")
public class AuthenticationController {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UsersRepository userRepository;

    @Autowired
    RolesRepositoey roleRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JWTService jwtService;

    @PostMapping("/log_in")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginDTO loginDto) {
        
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

    @PostMapping("/sign_up")
    public ResponseEntity<?> signUpUser(@Valid @RequestBody SignUpDTO singUpDto) {
        if (userRepository.existsByUsername(singUpDto.getUsername())) {
        return ResponseEntity.badRequest().body(new MessageDTO("Error: Username is already taken!"));
        }

        if (userRepository.existsByEmail(singUpDto.getEmail())) {
        return ResponseEntity.badRequest().body(new MessageDTO("Error: Email is already in use!"));
        }

        Users user = new Users(singUpDto.getUsername(),
                            singUpDto.getEmail(),
                            encoder.encode(singUpDto.getPassword()));

        Set<String> strRoles = singUpDto.getRoles();
        Set<Roles> roles = new HashSet<>();

        if (strRoles == null) {
            Optional<Roles> userRoles = roleRepository.findByName("ROLE_USER");

            if(userRoles.isPresent()){
                roles.add(userRoles.get());
            }
            else{
                Roles userRole = new Roles();
                userRole.setName("ROLE_USER");
                roleRepository.save(userRole);
                roles.add(userRole);
            }
        } else {
            strRoles.forEach(role -> {
                switch (role) {
                    case "admin":
                    Roles adminRole = roleRepository.findByName("ROLE_ADMIN")
                        .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                    roles.add(adminRole);

                    break;
                    case "mod":
                    Roles modRole = roleRepository.findByName("ROLE_MODERATOR")
                        .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                    roles.add(modRole);

                    break;
                    default:
                    Roles userRole = roleRepository.findByName("ROLE_USER")
                        .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                    roles.add(userRole);
                }
            });
        }

        user.setRoles(roles);
        userRepository.save(user);

        return ResponseEntity.ok(new MessageDTO("User registered successfully!"));
    }

    @PostMapping("/log_out")
    public ResponseEntity<?> logoutUser() {
        
        ResponseCookie cookie = jwtService.createCookieWithNullToken();

        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, cookie.toString())
            .body(new MessageDTO("You've been signed out!"));
    }
}