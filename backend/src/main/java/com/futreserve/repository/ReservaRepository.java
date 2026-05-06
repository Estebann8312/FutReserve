package com.futreserve.repository;

import com.futreserve.model.Reserva;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ReservaRepository extends MongoRepository<Reserva, String> {
    List<Reserva> findByUsuarioId(String usuarioId);
    List<Reserva> findByCanchaId(String canchaId);
    List<Reserva> findByCanchaIdAndFecha(String canchaId, java.time.LocalDate fecha);
    java.util.Optional<Reserva> findByCanchaIdAndFechaAndHoraInicio(String canchaId, java.time.LocalDate fecha, String horaInicio);
}
