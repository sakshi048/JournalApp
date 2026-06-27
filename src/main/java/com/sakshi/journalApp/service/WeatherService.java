package com.sakshi.journalApp.service;

import com.sakshi.journalApp.api.response.WeatherResponse;
import com.sakshi.journalApp.cache.AppCache;
import com.sakshi.journalApp.constants.Placeholders;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;


@Service
public class WeatherService {

    @Value("${weather.api.key}")
    public String apiKey;

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private AppCache appCache;


    public WeatherResponse getWeather(String city) {
        if (appCache.APP_CACHE == null || !appCache.APP_CACHE.containsKey(AppCache.keys.WEATHER_API.toString())) {
            throw new IllegalStateException("Cache not loaded or WEATHER_API key missing. Keys present: "
                    + (appCache.APP_CACHE != null ? appCache.APP_CACHE.keySet() : "APP_CACHE is null"));
        }
        String finalAPI = appCache.APP_CACHE.get(AppCache.keys.WEATHER_API.toString())
                .replace(Placeholders.CITY, city)
                .replace(Placeholders.API_KEY, apiKey);
        ResponseEntity<WeatherResponse> response = restTemplate.exchange(finalAPI, HttpMethod.GET, null, WeatherResponse.class);
        return response.getBody();
    }



}
