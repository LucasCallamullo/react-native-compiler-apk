package com.vg.fileStore.controller;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.vg.fileStore.model.StoredFile;
import com.vg.fileStore.service.FileStorageService;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
public class FileController {

    private final FileStorageService service;

    // Subir archivo (multipart/form-data)
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<StoredFile> upload(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "owner", defaultValue = "anonymous") String owner
    ) throws IOException {
        return ResponseEntity.ok(service.store(file, owner));
    }

    // Listar archivos del owner
    @GetMapping
    public List<StoredFile> list(@RequestParam(defaultValue = "anonymous") String owner) {
        return service.listByOwner(owner);
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