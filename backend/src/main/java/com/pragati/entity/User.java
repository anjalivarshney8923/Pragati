package com.pragati.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.time.LocalDate;

@Entity
@Table(name = "users", uniqueConstraints = {
    @UniqueConstraint(columnNames = "mobileNumber")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String fullName;

    @Column(unique = true, nullable = false, length = 15)
    private String mobileNumber;

    private String email;

    @Column(nullable = false)
    private String password;

    private String state;
    private String district;
    private String village;
    private String panchayat;

    @Column(length = 12)
    private String aadhaarNumber;

    @Builder.Default
    private boolean aadhaarVerified = false;

    @Builder.Default
    private boolean faceVerified = false;

    private Integer age;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private Role role = Role.USER;

    @Lob
    private byte[] aadhaarImage;

    private String aadhaarImageContentType;

    @Lob
    private byte[] selfieImage;

    private String selfieImageContentType;

    private LocalDate dateOfBirth;

    @Builder.Default
    private boolean dobVerified = false;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
