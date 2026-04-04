package com.pragati.service;

import com.pragati.entity.Complaint;
import com.pragati.entity.Notification;
import com.pragati.entity.NotificationType;
import com.pragati.repository.ComplaintRepository;
import com.pragati.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EscalationService {

    private final ComplaintRepository complaintRepository;
    private final NotificationRepository notificationRepository;

    @Value("${escalation.level1.delay-ms:5000}")
    private long level1DelayMs;

    @Value("${escalation.level2.delay-ms:10000}")
    private long level2DelayMs;

    @Async
    public void scheduleEscalation(Long complaintId, Long userId, String complaintToken) {
        try {
            Thread.sleep(level1DelayMs);
            complaintRepository.findById(complaintId).ifPresent(c -> {
                c.setEscalationLevel(1);
                complaintRepository.save(c);
                log.info("Complaint {} escalated to level 1", complaintToken);
            });
            saveNotification(userId, complaintId, "Escalation Available: Vibhag",
                "Your complaint (ID: " + complaintToken + ") has been registered. " +
                "If your issue is not resolved, you can now escalate it to the concerned department (Vibhag).");
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            log.error("Escalation level 1 interrupted for complaint {}", complaintId);
            return;
        }

        try {
            Thread.sleep(level2DelayMs - level1DelayMs);
            complaintRepository.findById(complaintId).ifPresent(c -> {
                c.setEscalationLevel(2);
                complaintRepository.save(c);
                log.info("Complaint {} escalated to level 2", complaintToken);
            });
            saveNotification(userId, complaintId, "Escalation Available: BDO",
                "If your complaint (ID: " + complaintToken + ") is still unresolved, " +
                "you can now escalate it to the Block Development Officer (BDO).");
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            log.error("Escalation level 2 interrupted for complaint {}", complaintId);
        }
    }

    private void saveNotification(Long userId, Long complaintId, String title, String message) {
        notificationRepository.save(Notification.builder()
                .userId(userId)
                .relatedComplaintId(complaintId)
                .title(title)
                .message(message)
                .type(NotificationType.ESCALATION)
                .build());
    }
}
