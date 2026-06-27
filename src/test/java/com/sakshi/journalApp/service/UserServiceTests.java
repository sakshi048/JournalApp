package com.sakshi.journalApp.service;

import com.sakshi.journalApp.entity.Users;
import com.sakshi.journalApp.repository.UserRepository;
import org.junit.jupiter.api.*;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ArgumentsSource;
import org.junit.jupiter.params.provider.CsvSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class UserServiceTests {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

//   @BeforeEach()
//   @BeforeAll()
//   @AfterAll();
//   @AfterEach();
//    void setUp() {
//        //
//    }

    //example: before each test u make csv then after test execution u delete it

    @AfterEach
    void cleanUp() {
        userRepository.deleteByUsername("sakusaa");
        userRepository.deleteByUsername("gharat");
    }

    @ParameterizedTest
    @ArgumentsSource(UserArgumentsProvider.class)
    public void testSaveNewUser(Users user) {
        // assert = dava karna;
        assertTrue(userService.saveNewUser(user));
    }

    @Disabled
    @ParameterizedTest
    @CsvSource({
            "1, 1, 2",
            "2, 2, 4",
            "3, 3, 6"
    })
    public void test(int a, int b, int expected) {
        assertEquals(expected, a + b);
    }
}
