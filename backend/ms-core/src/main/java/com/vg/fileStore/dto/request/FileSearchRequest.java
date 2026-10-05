package com.vg.fileStore.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

/**
 * Filtros para listar archivos.
 * Spring lo bindea automáticamente desde los query params:
 *   GET /api/files?userId=...&contentType=image/png&page=0&size=20
 *
 * El bloque { } es el "compact constructor" del record:
 * se ejecuta antes de asignar los campos y sirve para dar defaults o validar.
 */
public record FileSearchRequest(

        @NotNull(message = "userId es obligatorio")
        UUID userId,

        String contentType,      // opcional, ej "image/png"
        String nameContains,     // opcional, búsqueda parcial por nombre

        @Min(value = 0, message = "page no puede ser negativo")
        Integer page,

        @Min(value = 1, message = "size debe ser al menos 1")
        @Max(value = 100, message = "size no puede superar 100")
        Integer size
) {
    public FileSearchRequest {
        if (page == null) page = 0;
        if (size == null) size = 20;
    }
}