package com.pragati.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "work_proofs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkProof {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long complaintId;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private String imageUrl; // Main/After image

    @Column(nullable = true)
    private String beforeImageUrl;

    @Column(name = "blockchain_txn_id", nullable = true)
    private String blockchainTxnId;

    @Column(name = "blockchain_hash", nullable = true)
    private String blockchainHash;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
}
