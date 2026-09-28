package com.vg.file.model;

import java.time.LocalDateTime;
import java.util.UUID;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.vg.auth.model.User;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;



@Getter 
@Setter
@NoArgsConstructor 
@Builder
@AllArgsConstructor

@Entity
@Table(name = "files", uniqueConstraints = {
    @UniqueConstraint (columnNames = "name") })
    // Hacer que sea unico por nombre y usuario -> ACORDARME
public class FileEntity {
    

    @Id 
    @GeneratedValue (strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column (nullable = false, length = 10)
    private String extension;

    @Column (nullable = false)
    private String storagePath;

    
    @Column(nullable = false)
    private Long sizeBytes;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private FileAccessLevel accessLevel;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /*Esta hasta ver la implementación en frontend o si contentType*/

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private FileType type;

    @Column
    private String description;

    @CreationTimestamp 
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "Update_at", nullable = false)
    private LocalDateTime updatedAt;


}
