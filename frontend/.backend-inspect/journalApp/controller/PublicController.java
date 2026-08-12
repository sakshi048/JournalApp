package com.sakshi.journalApp.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import com.sakshi.journalApp.dto.UserDTO;
import  com.sakshi.journalApp.entity.Users;
import  com.sakshi.journalApp.service.UserDetailsServiceImpl;
import com.sakshi.journalApp.service.UserService;
import  com.sakshi.journalApp.utils.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/public")
public class PublicController {
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private UserDetailsServiceImpl userDetailsService;
    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private UserService userService;

    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody Users users) {
        try {
            userService.saveNewUser(users);
            return new ResponseEntity<>("User created", HttpStatus.CREATED);
        } catch (Exception e) {
            log.error("Signup failed", e);
            return new ResponseEntity<>("Signup failed", HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody Users user) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword()));
            UserDetails userDetails = userDetailsService.loadUserByUsername(user.getUsername());
            return new ResponseEntity<>(jwtUtil.generateToken(userDetails.getUsername()), HttpStatus.OK);
        } catch (Exception e) {
            log.error("Login failed", e);
            return new ResponseEntity<>("Incorrect username or password", HttpStatus.BAD_REQUEST);
        }
    }
}