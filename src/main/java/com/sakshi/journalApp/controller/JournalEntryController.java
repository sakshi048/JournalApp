package com.sakshi.journalApp.controller;

import com.sakshi.journalApp.entity.JournalEntry;
import com.sakshi.journalApp.entity.Users;
import com.sakshi.journalApp.service.JournalEntryService;
import com.sakshi.journalApp.service.UserService;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/journal")
public class JournalEntryController {

    @Autowired
    private JournalEntryService journalEntryService;


    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<?> getAllJournalEntriesOfUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        Users users = userService.findByUsername(username);
        List<JournalEntry> all = users.getJournalEntries();
        if (all != null && !all.isEmpty()) {
            return new ResponseEntity<>(all, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PostMapping
    public ResponseEntity<JournalEntry> createEntry(@RequestBody JournalEntry myEntry) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            myEntry.setDate(LocalDateTime.now());
            journalEntryService.saveEntry(myEntry, username);
            return new ResponseEntity<>(myEntry, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("id/{myId}")
    public ResponseEntity<JournalEntry> getJournalByID(@PathVariable ObjectId myId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        Users user = userService.findByUsername(username);
        List<JournalEntry> collect = user.getJournalEntries().stream().filter(x -> x.getId().equals(myId)).collect(Collectors.toList()); //uss jitne bhi user ki myid agar higi
        if (!collect.isEmpty()) {
            Optional<JournalEntry> journalEntry = journalEntryService.findById(myId);
            if (journalEntry.isPresent()) {
                return new ResponseEntity<>(journalEntry.get(), HttpStatus.OK);
            }
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @DeleteMapping("id/{myId}")
    public ResponseEntity<?> deleteJournalByID(@PathVariable ObjectId myId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        boolean removed = journalEntryService.deleteById(myId, username);
        if (removed) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("id/{myId}")
    public ResponseEntity<?> updateJournalByID(@PathVariable ObjectId myId, @RequestBody JournalEntry newEntry) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        Users user = userService.findByUsername(username);
        List<JournalEntry> collect = user.getJournalEntries().stream().filter(x -> x.getId().equals(myId)).collect(Collectors.toList());
        if (!collect.isEmpty()) {
            Optional<JournalEntry> journalEntry = journalEntryService.findById(myId);
            if (journalEntry.isPresent()) {
                JournalEntry old = journalEntry.get();
                old.setTitle(newEntry.getTitle() != null && !newEntry.getTitle().equals("") ? newEntry.getTitle() : old.getTitle());
                old.setContent(newEntry.getContent() != null && !newEntry.getContent().equals("") ? newEntry.getContent() : old.getContent());
                old.setTags(newEntry.getTags() != null ? newEntry.getTags() : old.getTags());
                journalEntryService.saveEntry(old);
                return new ResponseEntity<>(old, HttpStatus.OK);
            }
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            Users user = userService.findByUsername(username);
            List<JournalEntry> entries = user.getJournalEntries();

            java.util.Map<String, Object> stats = new java.util.HashMap<>();
            stats.put("totalEntries", entries != null ? entries.size() : 0);
            stats.put("thisMonth", entries != null ?
                    entries.stream()
                            .filter(e -> e.getDate() != null &&
                                         e.getDate().getMonth() == java.time.LocalDate.now().getMonth() &&
                                         e.getDate().getYear() == java.time.LocalDate.now().getYear())
                            .count() : 0);
            java.util.Map<String, Long> moodDistribution = entries != null ?
                    entries.stream()
                            .filter(e -> e.getSentiment() != null)
                            .collect(java.util.stream.Collectors.groupingBy(
                                    e -> e.getSentiment().name(),
                                    java.util.stream.Collectors.counting()))
                    : java.util.Map.of();
            stats.put("moodDistribution", moodDistribution);

            java.util.Map<String, Long> topThemes = entries != null ?
                    entries.stream()
                            .filter(e -> e.getTags() != null)
                            .flatMap(e -> e.getTags().stream())
                            .collect(java.util.stream.Collectors.groupingBy(
                                    tag -> tag,
                                    java.util.stream.Collectors.counting()))
                    : java.util.Map.of();
            stats.put("topThemes", topThemes);

            return new ResponseEntity<>(stats, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/{myId}")
    public ResponseEntity<JournalEntry> getJournalByIDAlternate(@PathVariable ObjectId myId) {
        return getJournalByID(myId);
    }

    @DeleteMapping("/{myId}")
    public ResponseEntity<?> deleteJournalByIDAlternate(@PathVariable ObjectId myId) {
        return deleteJournalByID(myId);
    }

    @PutMapping("/{myId}")
    public ResponseEntity<?> updateJournalByIDAlternate(@PathVariable ObjectId myId, @RequestBody JournalEntry newEntry) {
        return updateJournalByID(myId, newEntry);
    }
}