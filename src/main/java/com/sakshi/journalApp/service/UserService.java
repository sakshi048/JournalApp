package com.sakshi.journalApp.service;

import com.sakshi.journalApp.entity.JournalEntry;
import com.sakshi.journalApp.entity.Users;
import com.sakshi.journalApp.repository.JournalEntryRepository;
import com.sakshi.journalApp.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.apache.catalina.User;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
@Slf4j
public class UserService {
    @Autowired
    private UserRepository userRepository; //injection

    public void saveEntry(Users user) {
        userRepository.save(user);
    }
    public List<Users> getJournalEntries() {
        return userRepository.findAll();
    }

    public Users findByUsername(String username) {
        return userRepository.findByUsername(username);
    }
}
