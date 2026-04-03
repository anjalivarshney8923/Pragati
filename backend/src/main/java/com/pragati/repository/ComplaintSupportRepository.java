package com.pragati.repository;

import com.pragati.entity.ComplaintSupport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ComplaintSupportRepository extends JpaRepository<ComplaintSupport, Long> {
    boolean existsByComplaintIdAndUserId(Long complaintId, Long userId);
    long countByComplaintId(Long complaintId);
    List<ComplaintSupport> findByUserId(Long userId);
}
