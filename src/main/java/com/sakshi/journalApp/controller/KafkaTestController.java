package com.sakshi.journalApp.controller;

import com.sakshi.journalApp.service.KafkaProducerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/kafka-test")
public class KafkaTestController {

    @Autowired
    private KafkaProducerService kafkaProducerService;

    @GetMapping
    public String send(@RequestParam String msg) {
        kafkaProducerService.sendMessage("test-key", msg);
        return "sent: " + msg;
    }
}