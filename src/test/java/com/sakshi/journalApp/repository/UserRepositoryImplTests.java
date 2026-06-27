package com.sakshi.journalApp.repository;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.assertNotNull;


@SpringBootTest
public class UserRepositoryImplTests {

    @Autowired
    private UserRepositoryImpl userRepositoryImpl;

    @Test
    public void test(){
        Assertions.assertNotNull(userRepositoryImpl.getUserForSA());
    }


}
