package com.pragati.repository;

import com.pragati.entity.Officer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OfficerRepository extends JpaRepository<Officer, Long> {
    Optional<Officer> findByEmail(String email);
    Optional<Officer> findByEmployeeId(String employeeId);
    
    boolean existsByEmail(String email);
    boolean existsByEmployeeId(String employeeId);
}
