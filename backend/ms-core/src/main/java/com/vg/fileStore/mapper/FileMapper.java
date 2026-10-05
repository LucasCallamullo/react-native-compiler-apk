package com.vg.fileStore.mapper;

import com.vg.fileStore.dto.response.FileResponse;
import com.vg.fileStore.model.StoredFile;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

/**

 */
@Mapper(componentModel = "spring")
public interface FileMapper {

    /**
    
     * @param entity entidad StoredFile a convertir
     * @return DTO FileResponse con los datos expuestos al cliente
     */
    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "downloadUrl",
             expression = "java(\"/api/files/\" + entity.getId())")
    FileResponse toResponse(StoredFile entity);

    /**
     
     * @param entities lista de entidades StoredFile a convertir
     * @return lista de DTOs FileResponse
     */
    List<FileResponse> toResponseList(List<StoredFile> entities);
}