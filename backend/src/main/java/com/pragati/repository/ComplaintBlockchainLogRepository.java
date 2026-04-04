package com.pragati.repository;

import com.pragati.entity.ComplaintBlockchainLog;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ComplaintBlockchainLogRepository extends JpaRepository<ComplaintBlockchainLog, Long> {
    List<ComplaintBlockchainLog> findByComplaintIdOrderByTimestampAsc(Long complaintId);
}
