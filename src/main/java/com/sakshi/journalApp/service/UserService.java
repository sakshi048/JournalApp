package com.sakshi.journalApp.service;

import com.sakshi.journalApp.entity.Users;
import com.sakshi.journalApp.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
@Slf4j
public class UserService {
    @Autowired
    private UserRepository userRepository; //injection

    @Autowired
    private PasswordEncoder passwordEncoder;


    public boolean saveNewUser(Users user) {
        try {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            user.setRoles(Arrays.asList("USER"));
            userRepository.save(user);
            return true;
        } catch (Exception e) {
            log.error("Error occurred for: {}",user.getUsername(),e);
            return false;
        }

    }

    public void saveUser(Users user) {
        userRepository.save(user);
    }

    public void saveAdmin(Users user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRoles(Arrays.asList("USER","ADMIN"));
        userRepository.save(user);
    }

    public List<Users> getAll() {
        return userRepository.findAll();
    }

    public Users findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

}
