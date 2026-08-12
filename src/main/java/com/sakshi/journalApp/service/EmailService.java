package com.sakshi.journalApp.service;

import com.resend.Resend;
import com.resend.services.emails.model.CreateEmailOptions;
import com.resend.services.emails.model.CreateEmailResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class EmailService {

    private final Resend resend;

    public EmailService(@Value("${RESEND_API_KEY}") String apiKey) {
        this.resend = new Resend(apiKey);
    }

    // Kept the same signature (to, subject, body) as the old JavaMailSender
    // version so UserScheduler.java (and anything else calling this) doesn't
    // need to change.
    public void sendEmail(String to, String subject, String body) {
        try {
            CreateEmailOptions params = CreateEmailOptions.builder()
                    .from("Journal App <onboarding@resend.dev>")
                    .to(to)
                    .subject(subject)
                    .text(body)
                    .build();

            CreateEmailResponse response = resend.emails().send(params);

            log.info("========================================");
            log.info("Email sent successfully");
            log.info("To      : {}", to);
            log.info("Subject : {}", subject);
            log.info("Email Id: {}", response.getId());
            log.info("========================================");
        } catch (Exception e) {
            log.error("========================================");
            log.error("Failed to send email", e);
            log.error("========================================");
        }
    }
}