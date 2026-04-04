package com.pragati.repository;

import com.pragati.entity.Complaint;
import com.pragati.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ComplaintRepository extends JpaRepository<Complaint, Long> {
    List<Complaint> findByUserOrderByCreatedAtDesc(User user);
    List<Complaint> findAllByOrderByCreatedAtDesc();
    boolean existsByComplaintToken(String complaintToken);
}
