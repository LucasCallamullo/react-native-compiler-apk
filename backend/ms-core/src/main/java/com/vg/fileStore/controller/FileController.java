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

@RestController
@RequestMapping("/api/v1/files")
@RequiredArgsConstructor
public class FileController {

    private final FileStorageServiceImpl service;

    // Subir archivo (multipart/form-data)
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<FileResponse> upload(
            @RequestParam("file") MultipartFile file,
            @RequestParam("userId") UUID userId
    ) throws IOException {
        return ResponseEntity.ok(service.store(file, userId));
    }

    // Listar archivos del owner
    @GetMapping
    public List<FileResponse> list(@RequestParam("userId") UUID userId) {
        return service.listByUserId(userId);
    }

    // Descargar / visualizar
    @GetMapping("/{id}")
    public ResponseEntity<Resource> download(@PathVariable UUID id) throws IOException {
        StoredFile meta = service.getMeta(id);
        Resource resource = service.loadAsResource(id);

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(meta.getContentType()))
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "inline; filename=\"" + meta.getOriginalName() + "\"")
                .body(resource);
    }

    // Borrar
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) throws IOException {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}