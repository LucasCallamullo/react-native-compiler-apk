package com.vg.fileStore.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.vg.fileStore.model.StoredFile;

import java.util.List;
import java.util.UUID;

public interface StoredFileRepository extends JpaRepository<StoredFile, UUID> {
    List<StoredFile> findByOwnerOrderByUploadedAtDesc(String owner);
}