package com.pragati.repository;

import com.pragati.entity.WorkProof;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface WorkProofRepository extends JpaRepository<WorkProof, Long> {
    List<WorkProof> findByComplaintId(Long complaintId);
    List<WorkProof> findAllByOrderByCreatedAtDesc();
}
