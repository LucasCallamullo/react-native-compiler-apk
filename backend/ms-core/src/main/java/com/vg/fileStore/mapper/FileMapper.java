package com.vg.fileStore.mapper;

import com.vg.fileStore.dto.response.FileResponse;
import com.vg.fileStore.model.StoredFile;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

/**
 * Mapper MapStruct.
 * <p>
 * MapStruct genera la implementación (FileMapperImpl) en tiempo de compilación
 * y la registra como bean de Spring gracias a componentModel = SPRING.
 * <p>
 * Reglas de mapeo automático:
 * - Campos con el mismo nombre se mapean solos.
 * - Campos calculados o con nombre distinto se anotan con @Mapping.
 */
@Mapper(componentModel = "spring")
public interface FileMapper {

    /**
     * Mapea StoredFile -> FileResponse.
     * <p>
     * Mapeos automáticos (mismo nombre en origen y destino):
     *   id, originalName, contentType, size, uploadedAt
     * <p>
     * Mapeos explícitos:
     *   userId      <- entity.user.id (¡OJO! acceder al id del proxy NO dispara lazy)
     *   downloadUrl <- cadena calculada
     * <p>
     * Ignoramos relativePath y storedName porque no van en el DTO.
     */
    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "downloadUrl",
             expression = "java(\"/api/files/\" + entity.getId())")
    FileResponse toResponse(StoredFile entity);

    /**
     * MapStruct genera automáticamente la implementación de este método
     * iterando la lista y llamando a toResponse para cada elemento.
     */
    List<FileResponse> toResponseList(List<StoredFile> entities);
}