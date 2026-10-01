package com.vg.contact.repository;

import com.vg.contact.model.Contact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ContactRepository extends JpaRepository<Contact, Long> {

    /**
     * Busca un contacto por su ID (Long) y el UUID del usuario dueño (FK user_id).
     * Implementa el doble factor de seguridad: ambos valores deben coincidir
     * para que el contacto sea considerado válido para ese usuario.
     *
     * @param id     el ID interno del contacto (Long)
     * @param userId el UUID del usuario dueño (FK)
     * @return Optional con el contacto si ambos coinciden, vacío en caso contrario
     */
    @Query("SELECT c FROM Contact c WHERE c.id = :id AND c.user.id = :userId")
    Optional<Contact> findByIdAndUserId(@Param("id") Long id, @Param("userId") UUID userId);

    /**
     * Finds all contacts belonging to a specific user.
     */
    List<Contact> findByUserId(UUID userId);

    /**
     * Checks if a contact exists with the given email for a specific user.
     */
    boolean existsByEmailAndUserId(String email, UUID userId);
}
