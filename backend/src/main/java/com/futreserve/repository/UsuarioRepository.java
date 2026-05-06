package com.futreserve.repository;

import com.futreserve.model.Usuario;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface UsuarioRepository extends MongoRepository<Usuario, String> {
    Optional<Usuario> findByEmail(String email);
    boolean existsByEmail(String email);
    java.util.List<Usuario> findByRole(com.futreserve.model.Role role);
}
