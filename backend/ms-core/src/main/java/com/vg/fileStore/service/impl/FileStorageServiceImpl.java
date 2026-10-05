package com.vg.fileStore.service.impl;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
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
import com.vg.shared.exception.AppException;

import java.io.IOException;
import java.io.InputStream;
import java.io.UncheckedIOException;
import java.nio.file.*;
import java.time.Instant;
import java.time.ZoneOffset;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Implementación del servicio de almacenamiento de archivos.
 * Gestiona el guardado físico en disco, la persistencia de metadatos en BD
 * y la carga/eliminación de archivos.
 * Inyección por constructor vía Lombok (@RequiredArgsConstructor).
 */
@Service
@RequiredArgsConstructor
public class FileStorageServiceImpl implements FileStorageService {

    /**
     * Repositorio JPA para los metadatos de archivos.
     */
    private final StoredFileRepository repository;

    /**
     * Servicio de usuarios, usado para validar la existencia del propietario.
     */
    private final UserService userService;

    /**
     * Mapper MapStruct entre la entidad StoredFile y el DTO FileResponse.
     */
    private final FileMapper fileMapper;

    /**
     * Directorio raíz de almacenamiento, inyectado desde la propiedad "storage.root".
     */
    @Value("${storage.root}")
    private String rootDir;

    /**
     * Ruta absoluta y normalizada del directorio raíz (se inicializa en @PostConstruct).
     */
    private Path root;

    /**
     * Inicializa el directorio raíz de almacenamiento al arrancar el bean.
     * Crea las carpetas necesarias si no existen.
     */
    @PostConstruct
    public void init() {
        try {
            root = Paths.get(rootDir).toAbsolutePath().normalize();
            Files.createDirectories(root);
        } catch (IOException e) {
            throw new AppException(
                    "No se pudo inicializar el directorio de almacenamiento: " + rootDir,
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Almacena un archivo asociado a un usuario.
     * Valida que el archivo no esté vacío y que el usuario exista,
     * genera un nombre físico único (uuid + extensión) y organiza el archivo
     * en subcarpetas por año/mes para no saturar una sola carpeta.
     * Aplica comprobaciones anti path traversal.
     *
     * @param file   archivo subido
     * @param userId id del usuario propietario
     * @return metadatos del archivo guardado
     */
    @Override
    @Transactional
    public FileResponse store(MultipartFile file, UUID userId) {
        if (file == null || file.isEmpty()) {
            throw new AppException("Archivo vacío", HttpStatus.BAD_REQUEST);
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
                throw new AppException("Ruta de destino inválida", HttpStatus.BAD_REQUEST);
            }

            try (InputStream in = file.getInputStream()) {
                Files.copy(in, target, StandardCopyOption.REPLACE_EXISTING);
            }
        } catch (IOException e) {
            throw new AppException(
                    "Error al guardar el archivo: " + original,
                    HttpStatus.INTERNAL_SERVER_ERROR);
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

    /**
     * Carga un archivo del disco como recurso descargable.
     * Aplica comprobaciones anti path traversal y verifica que el archivo
     * exista y sea legible.
     *
     * @param id id del archivo almacenado
     * @return recurso listo para descarga
     */
    @Override
    @Transactional(readOnly = true)
    public Resource loadAsResource(Long id) {
        StoredFile meta = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("No existe archivo con id: " + id));

        Path path = root.resolve(meta.getRelativePath()).normalize();

        // Seguridad: evitar path traversal
        if (!path.startsWith(root)) {
            throw new AppException("Ruta inválida", HttpStatus.BAD_REQUEST);
        }

        try {
            Resource resource = new UrlResource(path.toUri());
            if (!resource.exists() || !resource.isReadable()) {
                throw new AppException(
                        "Archivo no accesible: " + id,
                        HttpStatus.NOT_FOUND);
            }
            return resource;
        } catch (IOException e) {
            throw new AppException(
                    "Error al leer el archivo con id: " + id,
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Obtiene los metadatos de un archivo por su id.
     *
     * @param id id del archivo
     * @return entidad StoredFile
     */
    @Override
    @Transactional(readOnly = true)
    public StoredFile getMeta(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new AppException(
                        "No existe archivo con id: " + id,
                        HttpStatus.NOT_FOUND));
    }

    /**
     * Lista todos los archivos de un usuario, mapeados a DTO.
     *
     * @param userId id del usuario
     * @return lista de respuestas con metadatos
     */
    @Override
    @Transactional(readOnly = true)
    public List<FileResponse> listByUserId(UUID userId) {
        return repository.findByUser(userId).stream()
                .map(fileMapper::toResponse)
                .collect(Collectors.toList());
    }

    /**
     * Elimina un archivo: primero el fichero físico en disco y después el registro en BD.
     * Aplica comprobaciones anti path traversal.
     *
     * @param id id del archivo
     */
    @Override
    @Transactional
    public void delete(Long id) {
        StoredFile meta = getMeta(id);
        Path path = root.resolve(meta.getRelativePath()).normalize();

        if (!path.startsWith(root)) {
            throw new AppException("Ruta inválida al eliminar", HttpStatus.BAD_REQUEST);
        }

        try {
            Files.deleteIfExists(path);
        } catch (IOException e) {
            throw new AppException(
                    "Error al eliminar el archivo físico con id: " + id,
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }

        repository.delete(meta);
    }

    // ---------- helpers ----------

    /**
     * Sanea el nombre original del archivo: se queda solo con el nombre base,
     * elimina cualquier componente de ruta y reemplaza caracteres no permitidos por "_".
     * Devuelve "archivo" si el nombre es nulo o en blanco.
     *
     * @param name nombre original del archivo
     * @return nombre saneado
     */
    private String sanitize(String name) {
        if (name == null || name.isBlank()) return "archivo";
        // Nos quedamos solo con el nombre base y limpiamos caracteres raros
        String base = Paths.get(name).getFileName().toString();
        return base.replaceAll("[^a-zA-Z0-9._-]", "_");
    }

    /**
     * Extrae la extensión de un nombre de archivo en minúsculas.
     * Devuelve cadena vacía si no tiene extensión.
     *
     * @param name nombre del archivo
     * @return extensión sin punto, o cadena vacía
     */
    private String getExtension(String name) {
        int i = name.lastIndexOf('.');
        return (i >= 0) ? name.substring(i + 1).toLowerCase() : "";
    }
}