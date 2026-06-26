package com.sakshi.journalApp.service;

import com.sakshi.journalApp.entity.Users;
import com.sakshi.journalApp.repository.UserRepository;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;

import java.util.ArrayList;

import static org.mockito.Mockito.when;


public class UserDetailsServiceImplTests {
    @InjectMocks
    private UserDetailsServiceImpl userDetailsService;

    @Mock
    private UserRepository userRepository;

//    @BeforeEach
    void setUp() {
        MockitoAnnotations.initMocks(this);
    }

    @Test
    public void loadUserByUsernameTests() {
        when(userRepository.findByUsername(ArgumentMatchers.anyString())).thenReturn(Users.builder().username("ghmgh").password("fhggh").roles(new ArrayList<>()).build());
        UserDetails user = userDetailsService.loadUserByUsername("sakus");
        Assertions.assertNotNull(user);

    }
}
