//package com.sakshi.journalApp.service;
//
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.kafka.core.KafkaTemplate;
//import org.springframework.stereotype.Service;
//
//@Service
//@Slf4j
//public class KafkaProducerService {
//
//    private static final String TOPIC = "journalApp";
//
//    @Autowired
//    private KafkaTemplate<String, String> kafkaTemplate;
//
//    public void sendMessage(String key, String value) {
//        kafkaTemplate.send(TOPIC, key, value).addCallback(
//                result -> log.info("Produced to topic {}: key={} value={}", TOPIC, key, value),
////                ex -> log.error("Failed to produce message", ex)
//        );
//    }
//}