package com.pragati.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "officers")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Officer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String fullName;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String mobileNumber;

    @Column(unique = true, nullable = false)
    private String employeeId;

    @Column(nullable = false)
    private String password;

    private String department;
    private String designation;
    private String state;
    private String district;

    private String govtIdFilePath;
    private String appointmentLetterFilePath;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private OfficerRole role = OfficerRole.OFFICER;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private OfficerStatus status = OfficerStatus.PENDING;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
