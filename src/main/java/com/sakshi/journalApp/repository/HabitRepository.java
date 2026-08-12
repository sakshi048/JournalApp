package com.sakshi.journalApp.repository;

import com.sakshi.journalApp.entity.Habit;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface HabitRepository extends MongoRepository<Habit, ObjectId> {

}