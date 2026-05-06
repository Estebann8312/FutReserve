package com.futreserve.service;

import com.futreserve.dto.ReservaRequest;
import com.futreserve.model.Cancha;
import com.futreserve.model.Reserva;
import com.futreserve.repository.CanchaRepository;
import com.futreserve.repository.ReservaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReservaService {

    private final ReservaRepository reservaRepository;
    private final CanchaRepository canchaRepository;

    public Reserva create(ReservaRequest request, String usuarioId) {
    String canchaId = request.getCanchaId();
        if (canchaId == null || canchaId.isBlank()) {
            throw new RuntimeException("El ID de la cancha es requerido");
        }
        Cancha cancha = canchaRepository.findById(canchaId)
                .orElseThrow(() -> new RuntimeException("La cancha no existe"));

        if (!cancha.getDisponible()) {
            throw new RuntimeException("La cancha no está disponible para reservas");
        }

        // Check availability
        boolean isOccupied = reservaRepository.findByCanchaIdAndFechaAndHoraInicio(
                request.getCanchaId(), request.getFecha(), request.getHoraInicio()
        ).isPresent();

        if (isOccupied) {
            throw new RuntimeException("Ese horario ya está ocupado");
        }

        Reserva reserva = new Reserva();
        reserva.setUsuarioId(usuarioId);
        reserva.setCanchaId(request.getCanchaId());
        reserva.setFecha(request.getFecha());
        reserva.setHoraInicio(request.getHoraInicio());
        reserva.setHoraFin(request.getHoraFin());
        reserva.setTotal(cancha.getPrecioHora()); // Simplification: 1 hour only
        reserva.setEstado("CONFIRMADA");

        return reservaRepository.save(reserva);
    }

    public List<Reserva> getByUsuarioId(String usuarioId) {
        return reservaRepository.findByUsuarioId(usuarioId);
    }

    public List<Reserva> getByCanchaIdAndFecha(String canchaId, LocalDate fecha) {
        return reservaRepository.findByCanchaIdAndFecha(canchaId, fecha);
    }
}
