package com.futreserve.service;

import com.futreserve.dto.AuthResponse;
import com.futreserve.dto.LoginRequest;
import com.futreserve.dto.RegisterRequest;
import com.futreserve.model.Usuario;
import com.futreserve.repository.UsuarioRepository;
import com.futreserve.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthResponse register(RegisterRequest request) {
        if (usuarioRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("El email ya está registrado");
        }

        Usuario usuario = new Usuario();
        usuario.setNombre(request.getNombre());
        usuario.setEmail(request.getEmail());
        usuario.setPassword(passwordEncoder.encode(request.getPassword()));
        
        if ("OWNER".equals(request.getRole())) {
            usuario.setRole(com.futreserve.model.Role.OWNER);
        } else {
            usuario.setRole(com.futreserve.model.Role.USER);
        }

        usuarioRepository.save(usuario);

        String token = jwtUtil.generateToken(usuario.getEmail());
        return new AuthResponse(token, usuario.getNombre(), usuario.getEmail(), usuario.getRole() != null ? usuario.getRole().name() : "USER", usuario.getId());
    }

    public AuthResponse login(LoginRequest request) {
        Usuario usuario = usuarioRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Credenciales inválidas"));

        if (!passwordEncoder.matches(request.getPassword(), usuario.getPassword())) {
            throw new RuntimeException("Credenciales inválidas");
        }

        String token = jwtUtil.generateToken(usuario.getEmail());
        return new AuthResponse(token, usuario.getNombre(), usuario.getEmail(), usuario.getRole() != null ? usuario.getRole().name() : "USER", usuario.getId());
    }
}
