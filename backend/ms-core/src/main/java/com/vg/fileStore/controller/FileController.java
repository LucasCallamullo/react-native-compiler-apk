package com.vg.fileStore.controller;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.vg.fileStore.dto.response.FileResponse;
import com.vg.fileStore.model.StoredFile;
import com.vg.fileStore.service.impl.FileStorageServiceImpl;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

/**
 * Controlador REST para la gestión de archivos.
 * Base URL: /api/v1/files
 * Inyección por constructor vía Lombok (@RequiredArgsConstructor).
 */
@RestController
@RequestMapping("/api/v1/files")
@RequiredArgsConstructor
public class FileController {

    /**
     * Servicio de almacenamiento de archivos (implementación concreta).
     */
    private final FileStorageServiceImpl service;

    /**
     * Sube un archivo asociado a un usuario.
     * Consume multipart/form-data.
     *
     * @param file   archivo subido (parte "file" del formulario)
     * @param userId id del usuario propietario (parámetro "userId")
     * @return metadatos del archivo guardado
     * @throws IOException si ocurre un error de E/S durante el almacenamiento
     */
    // Subir archivo (multipart/form-data)
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<FileResponse> upload(
            @RequestParam("file") MultipartFile file,
            @RequestParam("userId") UUID userId
    ) throws IOException {
        return ResponseEntity.ok(service.store(file, userId));
    }

    /**
     * Lista todos los archivos pertenecientes a un usuario.
     *
     * @param userId id del usuario propietario (query param "userId")
     * @return lista de metadatos de los archivos del usuario
     */
    // Listar archivos del owner
    @GetMapping
    public List<FileResponse> list(@RequestParam("userId") UUID userId) {
        return service.listByUserId(userId);
    }

    /**
     * Descarga o visualiza un archivo por su id.
     * Se devuelve con Content-Disposition "inline" para permitir visualización en el navegador.
     *
     * @param id id del archivo almacenado
     * @return recurso listo para descarga con su tipo MIME y cabecera de disposición
     * @throws IOException si ocurre un error de E/S al cargar el recurso
     */
    // Descargar / visualizar
    @GetMapping("/{id}")
    public ResponseEntity<Resource> download(@PathVariable Long id) throws IOException {
        StoredFile meta = service.getMeta(id);
        Resource resource = service.loadAsResource(id);

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(meta.getContentType()))
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "inline; filename=\"" + meta.getOriginalName() + "\"")
                .body(resource);
    }

    /**
     * Elimina un archivo (registro en BD y archivo físico).
     *
     * @param id id del archivo a eliminar
     * @return respuesta 204 No Content si la eliminación fue exitosa
     * @throws IOException si ocurre un error de E/S durante el borrado
     */
    // Borrar
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) throws IOException {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}