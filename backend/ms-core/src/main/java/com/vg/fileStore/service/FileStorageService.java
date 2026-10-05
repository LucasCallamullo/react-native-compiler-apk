package com.vg.fileStore.service;

import com.vg.fileStore.dto.response.FileResponse;
import com.vg.fileStore.model.StoredFile;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;


public interface FileStorageService {

    /**
     * Almacena un archivo asociado a un usuario.
     *
     * @param file   archivo subido
     * @param userId id del usuario propietario
     * @return metadatos del archivo guardado
     */
    FileResponse store(MultipartFile file, UUID userId);

    /**
     * Carga un archivo como recurso descargable.
     *
     * @param id id del archivo almacenado
     * @return recurso listo para descarga
     */
    Resource loadAsResource(Long id);

    /**
     * Obtiene los metadatos de un archivo.
     *
     * @param id id del archivo
     * @return entidad StoredFile
     */
    StoredFile getMeta(Long id);

    /**
     * Lista todos los archivos de un usuario.
     *
     * @param userId id del usuario
     * @return lista de respuestas con metadatos
     */
    List<FileResponse> listByUserId(UUID userId);

    /**
     * Elimina un archivo (físico + registro en BD).
     *
     * @param id id del archivo
     */
    void delete(Long id);
}