package com.pragati.repository;

import com.pragati.entity.BDOComplaint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BDOComplaintRepository extends JpaRepository<BDOComplaint, Long> {
    boolean existsByComplaintId(Long complaintId);
}
