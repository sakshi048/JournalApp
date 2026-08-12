package com.sakshi.journalApp.service;

import com.sakshi.journalApp.entity.JournalEntry;
import com.sakshi.journalApp.entity.Users;
import com.sakshi.journalApp.repository.JournalEntryRepository;
import lombok.extern.slf4j.Slf4j;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
public class JournalEntryService {
    @Autowired
    private JournalEntryRepository journalEntryRepository; //injection

    @Autowired
    private UserService userService;

    // Logback private static final Logger logger = LoggerFactory.getLogger(JournalEntryService.class);

//    @Transactional
    public void saveEntry(JournalEntry journalEntry, String username) {
        try {
            Users user = userService.findByUsername(username);
            journalEntry.setDate(LocalDateTime.now ());
            JournalEntry saved = journalEntryRepository.save(journalEntry);
            user.getJournalEntries().add(saved);
            userService.saveUser(user);
        } catch (Exception e) {
            log.error("Exception ", e);
            throw new RuntimeException("An error occurred while saving the entry");
        }
    }

    public void saveEntry(JournalEntry journalEntry) {
        journalEntryRepository.save(journalEntry);
    }
    
    public List<JournalEntry> getAll() {
        return journalEntryRepository.findAll();
    }

    public Optional<JournalEntry> findById(ObjectId id) {
        return journalEntryRepository.findById(id);
    }

//    @Transactional
    public boolean deleteById(ObjectId id, String username) {
        boolean removed = false;
        try {
            Users user = userService.findByUsername(username);
            removed = user.getJournalEntries().removeIf(x -> x.getId().equals(id));
            if (removed) {
                userService.saveUser(user);
                journalEntryRepository.deleteById(id);
            }
        } catch(Exception e) {
            System.out.print("e");
            throw new RuntimeException("An error occurred while deleting the entry");
        }
        return removed;
    }
}
