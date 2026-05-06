package com.futreserve.controller;

import com.futreserve.model.Role;
import com.futreserve.model.Usuario;
import com.futreserve.repository.CanchaRepository;
import com.futreserve.repository.ReservaRepository;
import com.futreserve.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
public class UsuarioController {

    private final UsuarioRepository usuarioRepository;
    private final CanchaRepository canchaRepository;
    private final ReservaRepository reservaRepository;

    @GetMapping
    public ResponseEntity<List<Usuario>> getAll() {
        return ResponseEntity.ok(usuarioRepository.findAll());
    }

    @GetMapping("/owners")
    public ResponseEntity<List<Usuario>> getOwners() {
        return ResponseEntity.ok(usuarioRepository.findByRole(Role.OWNER));
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Usuario user = usuarioRepository.findByEmail(auth.getName()).orElse(null);

        Map<String, Object> stats = new HashMap<>();

        if (user != null && user.getRole() == Role.ADMIN) {
            // Admin: global stats
            stats.put("totalCanchas", canchaRepository.count());
            stats.put("totalUsuarios", usuarioRepository.count());
            stats.put("totalOwners", usuarioRepository.findByRole(Role.OWNER).size());
            stats.put("totalClientes", usuarioRepository.findByRole(Role.USER).size());
            stats.put("totalReservas", reservaRepository.count());
            stats.put("canchas", canchaRepository.findAll());
            stats.put("reservas", reservaRepository.findAll());

        } else if (user != null && user.getRole() == Role.OWNER) {
            // Owner: stats for their courts only
            var misCanchas = canchaRepository.findByOwnerId(user.getId());
            long misReservas = misCanchas.stream()
                    .mapToLong(c -> reservaRepository.findByCanchaId(c.getId()).size())
                    .sum();
            stats.put("totalCanchas", misCanchas.size());
            stats.put("totalReservas", misReservas);
            stats.put("canchas", misCanchas);
            // Recent reservations across all their courts
            var todasReservas = misCanchas.stream()
                    .flatMap(c -> reservaRepository.findByCanchaId(c.getId()).stream())
                    .toList();
            stats.put("reservas", todasReservas);

        } else {
            // USER: their own reservations
            var misReservas = user != null ? reservaRepository.findByUsuarioId(user.getId()) : List.of();
            stats.put("totalReservas", misReservas.size());
            stats.put("reservas", misReservas);
            stats.put("totalCanchas", canchaRepository.count());
        }

        return ResponseEntity.ok(stats);
    }
}

