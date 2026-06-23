package com.sakshi.journalApp.repository;

import com.sakshi.journalApp.entity.JournalEntry;
import com.sakshi.journalApp.entity.Users;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserRepository extends MongoRepository<Users, ObjectId> {
    Users findByUsername(String username);

    Users deleteByUsername(String username);
}
