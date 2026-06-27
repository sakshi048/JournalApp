package com.sakshi.journalApp.service;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.redis.core.RedisTemplate;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
public class RedisTest {

    @Autowired
    private RedisTemplate<String, String> redisTemplate;

    @Test
    void testRedisSetAndGet() {
        redisTemplate.opsForValue().set("email", "gmail@email.com");
        Object email = redisTemplate.opsForValue().get("email");
        assertEquals("gmail@email.com", email);
    }

}