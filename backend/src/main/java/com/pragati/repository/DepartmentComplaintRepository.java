package com.pragati.repository;

import com.pragati.entity.DepartmentComplaint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DepartmentComplaintRepository extends JpaRepository<DepartmentComplaint, Long> {
    boolean existsByComplaintId(Long complaintId);
    List<DepartmentComplaint> findByDepartmentNameIgnoreCase(String departmentName);
}
