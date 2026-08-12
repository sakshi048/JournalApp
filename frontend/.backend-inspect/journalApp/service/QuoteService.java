package com.sakshi.journalApp.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class QuoteService {

    @Value("${quote.api.key}")
    public String apiKey;

}
