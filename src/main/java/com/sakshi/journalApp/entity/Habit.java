package com.sakshi.journalApp.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.Map;

@Document(collection = "habits")
@Data
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class Habit {

    @Id
    @JsonSerialize(using = ToStringSerializer.class)
    private ObjectId id;

    @NonNull
    private String name;

    private String category;       // e.g. "Health", "Mindfulness", "Personal"
    private String reminderTime;   // e.g. "8:00 AM"
    private String color;          // e.g. "sage", "gold" - for UI badges

    private LocalDate createdDate;

    // key = date as "yyyy-MM-dd", value = whether completed that day
    private Map<String, Boolean> completions = new LinkedHashMap<>();
}