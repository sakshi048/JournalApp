package com.sakshi.journalApp.controller;

import com.sakshi.journalApp.entity.Users;
import com.sakshi.journalApp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/public")
public class PublicController {
    @Autowired
    private UserService userService;

    @GetMapping("/health-check")
    public String healthCheck() {
        return "OK";
    }

    @PostMapping("/create-user")
    public ResponseEntity<Users> createUser(@RequestBody Users user) {
        userService.saveEntry(user);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

}
