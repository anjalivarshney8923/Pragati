package com.pragati.repository;

import com.pragati.entity.Complaint;
import com.pragati.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.time.LocalDateTime;

@Repository
public interface ComplaintRepository extends JpaRepository<Complaint, Long> {
    List<Complaint> findByUserOrderByCreatedAtDesc(User user);
    List<Complaint> findAllByOrderByCreatedAtDesc();
    boolean existsByComplaintToken(String complaintToken);
    boolean existsByUserAndTitleAndDescriptionAndCreatedAtAfter(User user, String title, String description, LocalDateTime dateTime);
}
