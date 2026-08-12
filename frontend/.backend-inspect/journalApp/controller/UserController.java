// Full corrected UserController.java:

package com.sakshi.journalApp.controller;

import com.sakshi.journalApp.api.response.WeatherResponse;
import com.sakshi.journalApp.entity.Users;
import com.sakshi.journalApp.repository.UserRepository;
import com.sakshi.journalApp.service.UserService;
import com.sakshi.journalApp.service.WeatherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private WeatherService weatherService;

    @Autowired
    private PasswordEncoder passwordEncoder;   // ADD THIS

    @PutMapping
    public ResponseEntity<?> updateUser(@RequestBody Users user) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        Users userInDb = userService.findByUsername(username);

        // Null-safe: only update fields the client actually sent
        if (user.getUsername() != null && !user.getUsername().isEmpty()) {
            userInDb.setUsername(user.getUsername());
        }
        if (user.getPassword() != null && !user.getPassword().isEmpty()) {
            userInDb.setPassword(passwordEncoder.encode(user.getPassword())); // BCrypt!
        }

        userService.saveUser(userInDb);   // saveUser(), NOT saveNewUser() — no role wipe
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @DeleteMapping
    public ResponseEntity<?> deleteUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        userRepository.deleteByUsername(authentication.getName());
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping
    public ResponseEntity<?> greetings() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        WeatherResponse weatherResponse = weatherService.getWeather("Mumbai");
        String greetings = "";
        if (weatherResponse != null) {
            greetings = ", Weather feels like: " + weatherResponse.getCurrent().getFeelslike();
        }
        return new ResponseEntity<>("Hi " + authentication.getName() + greetings, HttpStatus.OK);
    }
}