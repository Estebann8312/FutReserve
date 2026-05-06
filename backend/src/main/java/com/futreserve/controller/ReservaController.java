package com.futreserve.controller;

import com.futreserve.dto.ReservaRequest;
import com.futreserve.model.Reserva;
import com.futreserve.model.Usuario;
import com.futreserve.repository.UsuarioRepository;
import com.futreserve.service.ReservaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/reservas")
@RequiredArgsConstructor
public class ReservaController {

    private final ReservaService reservaService;
    private final UsuarioRepository usuarioRepository;

    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody ReservaRequest request) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            Usuario user = usuarioRepository.findByEmail(auth.getName())
                    .orElseThrow(() -> new RuntimeException("Usuario no autenticado"));

            return ResponseEntity.status(HttpStatus.CREATED).body(reservaService.create(request, user.getId()));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/mis-reservas")
    public ResponseEntity<List<Reserva>> getMisReservas() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Usuario user = usuarioRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("Usuario no autenticado"));

        return ResponseEntity.ok(reservaService.getByUsuarioId(user.getId()));
    }

    @GetMapping("/cancha/{canchaId}")
    public ResponseEntity<List<Reserva>> getPorCanchaYFecha(
            @PathVariable String canchaId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha) {
        return ResponseEntity.ok(reservaService.getByCanchaIdAndFecha(canchaId, fecha));
    }
}
