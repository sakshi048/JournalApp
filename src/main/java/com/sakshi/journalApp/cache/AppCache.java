//package com.sakshi.journalApp.cache;
//
//import com.sakshi.journalApp.entity.ConfigJournalAppEntity;
//import com.sakshi.journalApp.repository.ConfigJournalAppRepository;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Component;
//
//import javax.annotation.PostConstruct;
//import java.util.*;
//
//@Component
//public class AppCache {
//
//    public enum keys {
//        WEATHER_API;
//    }
//
//    @Autowired
//    private ConfigJournalAppRepository configJournalAppRepository;
//
//    public Map<String, String> APP_CACHE = new HashMap<>(); // ← add thisin memory cache
//
//    @PostConstruct
//    public void init() {
//        APP_CACHE = new HashMap<>();
//        List<ConfigJournalAppEntity> all = configJournalAppRepository.findAll();
//        for (ConfigJournalAppEntity configJournalAppEntity : all) {
//            APP_CACHE.put(configJournalAppEntity.getKey(), configJournalAppEntity.getValue());
//        }
//
//    }
//}
