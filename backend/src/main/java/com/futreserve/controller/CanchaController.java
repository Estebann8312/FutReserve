package com.futreserve.controller;

import com.futreserve.dto.CanchaRequest;
import com.futreserve.model.Cancha;
import com.futreserve.service.CanchaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import com.futreserve.repository.UsuarioRepository;
import com.futreserve.model.Usuario;
import com.futreserve.model.Role;

import java.util.List;

@RestController
@RequestMapping("/api/canchas")
@RequiredArgsConstructor
public class CanchaController {

    private final CanchaService canchaService;
    private final UsuarioRepository usuarioRepository;

    @GetMapping
    public ResponseEntity<List<Cancha>> getAll() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getName() != null) {
            Usuario user = usuarioRepository.findByEmail(auth.getName()).orElse(null);
            if (user != null && user.getRole() == Role.OWNER) {
                return ResponseEntity.ok(canchaService.getByOwnerId(user.getId()));
            }
        }
        return ResponseEntity.ok(canchaService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable String id) {
        try {
            return ResponseEntity.ok(canchaService.getById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody CanchaRequest request) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.getName() != null) {
                Usuario user = usuarioRepository.findByEmail(auth.getName()).orElse(null);
                if (user != null && user.getRole() == Role.OWNER) {
                    request.setOwnerId(user.getId());
                }
            }
            return ResponseEntity.status(HttpStatus.CREATED).body(canchaService.create(request));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable String id, @Valid @RequestBody CanchaRequest request) {
        try {
            return ResponseEntity.ok(canchaService.update(id, request));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable String id) {
        try {
            canchaService.delete(id);
            return ResponseEntity.ok().body("Cancha eliminada correctamente");
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
