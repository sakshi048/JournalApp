package com.sakshi.journalApp.controller;

import com.sakshi.journalApp.entity.Habit;
import com.sakshi.journalApp.entity.Users;
import com.sakshi.journalApp.service.HabitService;
import com.sakshi.journalApp.service.UserService;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/habit")
public class HabitController {

    @Autowired
    private HabitService habitService;

    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<?> getAllHabitsOfUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        Users user = userService.findByUsername(username);
        List<Habit> all = user.getHabits();
        if (all != null && !all.isEmpty()) {
            return new ResponseEntity<>(all, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PostMapping
    public ResponseEntity<Habit> createHabit(@RequestBody Habit habit) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            Habit saved = habitService.createHabit(habit, username);
            return new ResponseEntity<>(saved, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("id/{myId}")
    public ResponseEntity<Habit> getHabitById(@PathVariable ObjectId myId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        Users user = userService.findByUsername(username);
        List<Habit> collect = user.getHabits().stream().filter(x -> x.getId().equals(myId)).collect(Collectors.toList());
        if (!collect.isEmpty()) {
            Optional<Habit> habit = habitService.findById(myId);
            if (habit.isPresent()) {
                return new ResponseEntity<>(habit.get(), HttpStatus.OK);
            }
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PutMapping("id/{myId}")
    public ResponseEntity<?> updateHabit(@PathVariable ObjectId myId, @RequestBody Habit newHabit) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        Users user = userService.findByUsername(username);
        List<Habit> collect = user.getHabits().stream().filter(x -> x.getId().equals(myId)).collect(Collectors.toList());
        if (!collect.isEmpty()) {
            Optional<Habit> habitOpt = habitService.findById(myId);
            if (habitOpt.isPresent()) {
                Habit old = habitOpt.get();
                old.setName(newHabit.getName() != null && !newHabit.getName().equals("") ? newHabit.getName() : old.getName());
                old.setCategory(newHabit.getCategory() != null && !newHabit.getCategory().equals("") ? newHabit.getCategory() : old.getCategory());
                old.setReminderTime(newHabit.getReminderTime() != null && !newHabit.getReminderTime().equals("") ? newHabit.getReminderTime() : old.getReminderTime());
                old.setColor(newHabit.getColor() != null && !newHabit.getColor().equals("") ? newHabit.getColor() : old.getColor());
                habitService.saveHabit(old);
                return new ResponseEntity<>(old, HttpStatus.OK);
            }
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @DeleteMapping("id/{myId}")
    public ResponseEntity<?> deleteHabit(@PathVariable ObjectId myId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        boolean removed = habitService.deleteById(myId, username);
        if (removed) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Toggle completion for a given date (defaults to today). e.g. PATCH /habit/id/{id}/toggle?date=2026-08-11
    @PatchMapping("id/{myId}/toggle")
    public ResponseEntity<?> toggleCompletion(@PathVariable ObjectId myId,
                                              @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        Users user = userService.findByUsername(username);
        List<Habit> collect = user.getHabits().stream().filter(x -> x.getId().equals(myId)).collect(Collectors.toList());
        if (collect.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        LocalDate targetDate = date != null ? date : LocalDate.now();
        try {
            Habit updated = habitService.toggleCompletion(myId, targetDate);
            return new ResponseEntity<>(updated, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}