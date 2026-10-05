package com.vg.fileStore.service.impl;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.vg.auth.model.User;
import com.vg.auth.service.UserService;
import com.vg.fileStore.dto.response.FileResponse;
import com.vg.fileStore.mapper.FileMapper;
import com.vg.fileStore.model.StoredFile;
import com.vg.fileStore.repository.StoredFileRepository;
import com.vg.fileStore.service.FileStorageService;

import java.io.IOException;
import java.io.InputStream;
import java.io.UncheckedIOException;
import java.nio.file.*;
import java.time.Instant;
import java.time.ZoneOffset;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FileStorageServiceImpl implements FileStorageService {

    private final StoredFileRepository repository;
    private final UserService userService;
    private final FileMapper fileMapper;

    @Value("${storage.root}")
    private String rootDir;

    private Path root;

    @PostConstruct
    public void init() {
        try {
            root = Paths.get(rootDir).toAbsolutePath().normalize();
            Files.createDirectories(root);
        } catch (IOException e) {
            throw new UncheckedIOException("No se pudo inicializar el directorio de almacenamiento: " + rootDir, e);
        }
    }

    @Override
    @Transactional
    public FileResponse store(MultipartFile file, UUID userId) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Archivo vacío");
        }

        // Validar que el usuario exista
        User user = userService.validateUserExists(userId);

        String original = sanitize(file.getOriginalFilename());
        String ext = getExtension(original);
        String storedName = UUID.randomUUID() + (ext.isEmpty() ? "" : "." + ext);

        // Organizar por año/mes para no saturar una sola carpeta
        Instant now = Instant.now();
        int year = now.atZone(ZoneOffset.UTC).getYear();
        int month = now.atZone(ZoneOffset.UTC).getMonthValue();
        String subPath = year + "/" + String.format("%02d", month);

        try {
            Path targetDir = root.resolve(subPath);
            Files.createDirectories(targetDir);

            Path target = targetDir.resolve(storedName).normalize();

            // Seguridad: evitar path traversal
            if (!target.startsWith(root)) {
                throw new SecurityException("Ruta de destino inválida");
            }

            try (InputStream in = file.getInputStream()) {
                Files.copy(in, target, StandardCopyOption.REPLACE_EXISTING);
            }
        } catch (IOException e) {
            throw new UncheckedIOException("Error al guardar el archivo: " + original, e);
        }

        StoredFile meta = StoredFile.builder()
                .originalName(original)
                .storedName(storedName)
                .contentType(file.getContentType() == null
                        ? "application/octet-stream"
                        : file.getContentType())
                .size(file.getSize())
                .relativePath(subPath + "/" + storedName)
                .uploadedAt(now)
                .user(user)
                .build();

        StoredFile fileSaved = repository.save(meta);

        return fileMapper.toResponse(fileSaved);
    }

    @Override
    @Transactional(readOnly = true)
    public Resource loadAsResource(Long id) {
        StoredFile meta = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("No existe archivo con id: " + id));

        Path path = root.resolve(meta.getRelativePath()).normalize();

        // Seguridad: evitar path traversal
        if (!path.startsWith(root)) {
            throw new SecurityException("Ruta inválida");
        }

        try {
            Resource resource = new UrlResource(path.toUri());
            if (!resource.exists() || !resource.isReadable()) {
                throw new RuntimeException("Archivo no accesible: " + id);
            }
            return resource;
        } catch (IOException e) {
            throw new UncheckedIOException("Error al leer el archivo con id: " + id, e);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public StoredFile getMeta(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("No existe archivo con id: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<FileResponse> listByUserId(UUID userId) {
        return repository.findByUser(userId).stream()
                .map(fileMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void delete(Long id) {
        StoredFile meta = getMeta(id);
        Path path = root.resolve(meta.getRelativePath()).normalize();

        if (!path.startsWith(root)) {
            throw new SecurityException("Ruta inválida al eliminar");
        }

        try {
            Files.deleteIfExists(path);
        } catch (IOException e) {
            throw new UncheckedIOException("Error al eliminar el archivo físico con id: " + id, e);
        }

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