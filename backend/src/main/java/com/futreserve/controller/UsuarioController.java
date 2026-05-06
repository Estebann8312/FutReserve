package com.futreserve.controller;

import com.futreserve.model.Usuario;
import com.futreserve.model.Role;
import com.futreserve.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
public class UsuarioController {

    private final UsuarioRepository usuarioRepository;

    @GetMapping
    public ResponseEntity<List<Usuario>> getAll() {
        return ResponseEntity.ok(usuarioRepository.findAll());
    }

    @GetMapping("/owners")
    public ResponseEntity<List<Usuario>> getOwners() {
        return ResponseEntity.ok(usuarioRepository.findByRole(Role.OWNER));
    }
}
