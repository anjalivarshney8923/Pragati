package com.pragati.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "complaint_blockchain_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ComplaintBlockchainLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long complaintId;

    @Column(nullable = false)
    private String stage; // CREATED, PRADHAN, VIBHAG, BDO

    @Column(name = "blockchain_txn_id")
    private String blockchainTxnId;

    @Column(name = "blockchain_hash")
    private String blockchainHash;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime timestamp;
}
