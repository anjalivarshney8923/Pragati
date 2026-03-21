package com.pragati.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

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
    private boolean isAadhaarVerified = false;

    @Builder.Default
    private boolean isFaceVerified = false;

    private Integer age;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private Role role = Role.USER;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
