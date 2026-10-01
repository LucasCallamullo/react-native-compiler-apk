package com.vg.fileStore.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "stored_files")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class StoredFile {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(nullable = false)
    private String originalName;

    @Column(nullable = false, unique = true)
    private String storedName;      // nombre físico en disco (uuid + ext)

    @Column(nullable = false)
    private String contentType;

    @Column(nullable = false)
    private long size;

    @Column(nullable = false)
    private String relativePath;    // subcarpeta/archivo

    @Column(nullable = false)
    private Instant uploadedAt;

    @Column(nullable = false)
    private String owner;           // username o "anonymous"
}