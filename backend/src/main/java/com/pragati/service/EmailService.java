package com.pragati.service;

import com.pragati.entity.Complaint;
import com.pragati.entity.User;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:noreply@pragati.com}")
    private String fromEmail;

    @Async
    public void sendComplaintCreatedEmail(User user, Complaint complaint) {
        if (user.getEmail() == null || user.getEmail().isEmpty()) {
            log.warn("User {} has no email. Skipping complaint creation email.", user.getId());
            return;
        }

        String subject = "Complaint Submitted Successfully - ID: " + complaint.getId();
        String body = buildHtmlTemplate(user.getFullName(), "Your complaint regarding '" + complaint.getTitle() + "' has been successfully submitted.", complaint);

        sendEmail(user.getEmail(), subject, body);
    }

    @Async
    public void sendComplaintUpdatedEmail(User user, Complaint complaint, String officialResponse) {
        if (user.getEmail() == null || user.getEmail().isEmpty()) {
            return;
        }

        String subject = "Complaint Status Updated - ID: " + complaint.getId();
        String message = "Your complaint regarding '" + complaint.getTitle() + "' has been updated to status: " + complaint.getStatus() + ".";
        if (officialResponse != null && !officialResponse.isBlank()) {
            message += "<br/><br/><b>Official Response:</b> " + officialResponse;
        }

        String body = buildHtmlTemplate(user.getFullName(), message, complaint);

        sendEmail(user.getEmail(), subject, body);
    }

    public void sendEmail(String to, String subject, String htmlBody) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlBody, true); // true indicates html
            
            mailSender.send(message);
            log.info("Email sent successfully to {}", to);
        } catch (MessagingException e) {
            log.error("Failed to send email to {}", to, e);
        } catch (Exception e) {
            log.error("Unexpected error sending email: ", e);
        }
    }

    private String buildHtmlTemplate(String name, String message, Complaint complaint) {
        return "<html>" +
                "<body style='font-family: Arial, sans-serif; background-color: #f4f4f5; padding: 20px;'>" +
                "<div style='max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; border-top: 4px solid #1E3A8A;'>" +
                "<h2 style='color: #1E3A8A;'>Pragati GramSetu Portal</h2>" +
                "<p>Dear " + name + ",</p>" +
                "<p style='font-size: 16px; color: #333; line-height: 1.5;'>" + message + "</p>" +
                "<div style='background-color: #f8fafc; padding: 15px; border-radius: 5px; margin: 20px 0;'>" +
                "  <h3 style='margin-top: 0; color: #475569; font-size: 14px;'>Complaint Details</h3>" +
                "  <p style='margin: 5px 0;'><strong>Complaint ID:</strong> " + complaint.getId() + "</p>" +
                "  <p style='margin: 5px 0;'><strong>Category:</strong> " + complaint.getCategory() + "</p>" +
                "  <p style='margin: 5px 0;'><strong>Location:</strong> " + complaint.getLocation() + "</p>" +
                "  <p style='margin: 5px 0;'><strong>Status:</strong> <span style='font-weight: bold;'>" + complaint.getStatus() + "</span></p>" +
                "</div>" +
                "<p style='color: #64748b; font-size: 13px;'>This is an automated message. Please do not reply to this email.</p>" +
                "</div>" +
                "</body>" +
                "</html>";
    }
}
