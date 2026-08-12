package com.sakshi.journalApp.service;

import com.sakshi.journalApp.entity.Habit;
import com.sakshi.journalApp.entity.Users;
import com.sakshi.journalApp.repository.HabitRepository;
import lombok.extern.slf4j.Slf4j;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Optional;

@Service
@Slf4j
public class HabitService {

    @Autowired
    private HabitRepository habitRepository;

    @Autowired
    private UserService userService;

    @Transactional
    public Habit createHabit(Habit habit, String username) {
        try {
            Users user = userService.findByUsername(username);
            habit.setCreatedDate(LocalDate.now());
            Habit saved = habitRepository.save(habit);
            user.getHabits().add(saved);
            userService.saveUser(user);
            return saved;
        } catch (Exception e) {
            log.error("Exception while creating habit", e);
            throw new RuntimeException("An error occurred while creating the habit");
        }
    }

    public void saveHabit(Habit habit) {
        habitRepository.save(habit);
    }

    public Optional<Habit> findById(ObjectId id) {
        return habitRepository.findById(id);
    }

    @Transactional
    public boolean deleteById(ObjectId id, String username) {
        boolean removed;
        try {
            Users user = userService.findByUsername(username);
            removed = user.getHabits().removeIf(x -> x.getId().equals(id));
            if (removed) {
                userService.saveUser(user);
                habitRepository.deleteById(id);
            }
        } catch (Exception e) {
            log.error("Exception while deleting habit", e);
            throw new RuntimeException("An error occurred while deleting the habit");
        }
        return removed;
    }

    @Transactional
    public Habit toggleCompletion(ObjectId id, LocalDate date) {
        Optional<Habit> habitOpt = habitRepository.findById(id);
        if (habitOpt.isEmpty()) {
            throw new RuntimeException("Habit not found");
        }
        Habit habit = habitOpt.get();
        String key = date.toString(); // yyyy-MM-dd
        boolean current = habit.getCompletions().getOrDefault(key, false);
        habit.getCompletions().put(key, !current);
        return habitRepository.save(habit);
    }
}