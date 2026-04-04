package com.pragati.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "department_complaints")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DepartmentComplaint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "complaint_id", nullable = false)
    private Complaint complaint;

    @Column(nullable = false)
    private String departmentName;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime forwardedAt;

    @Builder.Default
    private String status = "FORWARDED";
}
