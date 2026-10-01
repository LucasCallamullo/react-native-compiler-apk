package com.vg.fileStore.service;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.vg.fileStore.model.StoredFile;
import com.vg.fileStore.repository.StoredFileRepository;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.*;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FileStorageService {

    private final StoredFileRepository repository;

    @Value("${storage.root}")
    private String rootDir;

    private Path root;

    @PostConstruct
    public void init() throws IOException {
        root = Paths.get(rootDir).toAbsolutePath().normalize();
        Files.createDirectories(root);
    }

    public StoredFile store(MultipartFile file, String owner) throws IOException {
        if (file.isEmpty()) throw new IllegalArgumentException("Archivo vacío");

        String original = sanitize(file.getOriginalFilename());
        String ext = getExtension(original);
        String storedName = UUID.randomUUID() + (ext.isEmpty() ? "" : "." + ext);

        // Organizar por año/mes para no saturar una sola carpeta
        Instant now = Instant.now();
        String subPath = now.atZone(java.time.ZoneOffset.UTC).getYear()
                + "/" + String.format("%02d", now.atZone(java.time.ZoneOffset.UTC).getMonthValue());

        Path targetDir = root.resolve(subPath);
        Files.createDirectories(targetDir);
        Path target = targetDir.resolve(storedName);

        try (InputStream in = file.getInputStream()) {
            Files.copy(in, target, StandardCopyOption.REPLACE_EXISTING);
        }

        StoredFile meta = StoredFile.builder()
                .originalName(original)
                .storedName(storedName)
                .contentType(file.getContentType() == null ? "application/octet-stream" : file.getContentType())
                .size(file.getSize())
                .relativePath(subPath + "/" + storedName)
                .uploadedAt(now)
                .owner(owner)
                .build();

        return repository.save(meta);
    }

    public Resource loadAsResource(UUID id) throws IOException {
        StoredFile meta = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("No existe: " + id));
        Path path = root.resolve(meta.getRelativePath()).normalize();

        // Seguridad: evitar path traversal
        if (!path.startsWith(root)) throw new SecurityException("Ruta inválida");

        Resource resource = new UrlResource(path.toUri());
        if (!resource.exists() || !resource.isReadable())
            throw new RuntimeException("Archivo no accesible");
        return resource;
    }

    public StoredFile getMeta(UUID id) {
        return repository.findById(id).orElseThrow(() -> new RuntimeException("No existe: " + id));
    }

    public List<StoredFile> listByOwner(String owner) {
        return repository.findByOwnerOrderByUploadedAtDesc(owner);
    }

    public void delete(UUID id) throws IOException {
        StoredFile meta = getMeta(id);
        Path path = root.resolve(meta.getRelativePath()).normalize();
        if (path.startsWith(root)) Files.deleteIfExists(path);
        repository.delete(meta);
    }

    // ---------- helpers ----------

    private String sanitize(String name) {
        if (name == null || name.isBlank()) return "archivo";
        // Nos quedamos solo con el nombre base y limpiamos caracteres raros
        String base = Paths.get(name).getFileName().toString();
        return base.replaceAll("[^a-zA-Z0-9._-]", "_");
    }

    private String getExtension(String name) {
        int i = name.lastIndexOf('.');
        return (i >= 0) ? name.substring(i + 1).toLowerCase() : "";
    }
}