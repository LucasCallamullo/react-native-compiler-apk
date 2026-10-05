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

        /**
         * id del usuario propietario de los archivos.
         * Obligatorio: no puede ser nulo.
         */
        @NotNull(message = "userId es obligatorio")
        UUID userId,

        /**
         * tipo MIME del archivo a filtrar (opcional).
         * Ejemplo: "image/png".
         */
        String contentType,      // opcional, ej "image/png"

        /**
         * cadena de búsqueda parcial sobre el nombre del archivo (opcional).
         */
        String nameContains,     // opcional, búsqueda parcial por nombre

        /**
         * número de página a recuperar (0-based).
         * Por defecto 0 si no se especifica. No puede ser negativo.
         */
        @Min(value = 0, message = "page no puede ser negativo")
        Integer page,

        /**
         * tamaño de página (cantidad de elementos por página).
         * Por defecto 20 si no se especifica. Debe estar entre 1 y 100.
         */
        @Min(value = 1, message = "size debe ser al menos 1")
        @Max(value = 100, message = "size no puede superar 100")
        Integer size
) {
    /**
     * Constructor compacto: aplica valores por defecto a page y size
     * antes de que los campos sean asignados.
     */
    public FileSearchRequest {
        if (page == null) page = 0;
        if (size == null) size = 20;
    }
}