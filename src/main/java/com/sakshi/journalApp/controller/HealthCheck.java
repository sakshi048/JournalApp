package com.sakshi.journalApp.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthCheck {

    //ha endpoint just check karel ki ok chalu ahe server
    @GetMapping("/health-check")
    public String healthCheck() {
        return "OK";
    }
}
