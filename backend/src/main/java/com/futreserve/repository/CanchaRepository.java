package com.futreserve.repository;

import com.futreserve.model.Cancha;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface CanchaRepository extends MongoRepository<Cancha, String> {
    List<Cancha> findByDisponibleTrue();
    List<Cancha> findByOwnerId(String ownerId);
}
