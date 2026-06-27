package com.sakshi.journalApp.controller;

import com.sakshi.journalApp.cache.AppCache;
import com.sakshi.journalApp.entity.Users;
import com.sakshi.journalApp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
public class AdminController {
    @Autowired
    private UserService userService;

    @Autowired
    private AppCache appCache;

    @GetMapping("/all-users")
    public ResponseEntity<?> getAllUsers() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        List<Users> all = userService.getAll();
        if (all != null && !all.isEmpty()) {
            return new ResponseEntity<>(all, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PostMapping("/create-admin-user")
    public void createAdminUser(@RequestBody Users user) {
        userService.saveAdmin(user);
    }

    @GetMapping("/clear-app-cache")
    public void clearAppCache() {
        appCache.init();
    }
}
