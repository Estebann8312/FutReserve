package com.futreserve;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class FutReserveApplication {
    public static void main(String[] args) {
        SpringApplication.run(FutReserveApplication.class, args);
    }

    @org.springframework.context.annotation.Bean
    public org.springframework.boot.CommandLineRunner seedOwners(
            com.futreserve.repository.CanchaRepository canchaRepository,
            com.futreserve.repository.UsuarioRepository usuarioRepository,
            org.springframework.security.crypto.password.PasswordEncoder passwordEncoder) {
        return args -> {
            java.util.List<com.futreserve.model.Cancha> canchas = canchaRepository.findAll();
            int count = 0;
            for (com.futreserve.model.Cancha cancha : canchas) {
                if (cancha.getOwnerId() == null || cancha.getOwnerId().isEmpty()) {
                    String emailBase = cancha.getNombre().toLowerCase().replaceAll("\\s+", "");
                    String email = emailBase + "@futreserve.com";
                    
                    com.futreserve.model.Usuario owner = usuarioRepository.findByEmail(email).orElse(null);
                    if (owner == null) {
                        owner = new com.futreserve.model.Usuario();
                        owner.setNombre("Dueño " + cancha.getNombre());
                        owner.setEmail(email);
                        owner.setPassword(passwordEncoder.encode("123456"));
                        owner.setRole(com.futreserve.model.Role.OWNER);
                        owner = usuarioRepository.save(owner);
                        System.out.println("Creado dueño: " + email);
                    } else if (owner.getRole() != com.futreserve.model.Role.OWNER) {
                        owner.setRole(com.futreserve.model.Role.OWNER);
                        owner = usuarioRepository.save(owner);
                    }

                    cancha.setOwnerId(owner.getId());
                    canchaRepository.save(cancha);
                    count++;
                }
            }
            if (count > 0) {
                System.out.println("Se han asignado dueños a " + count + " canchas.");
            }
        };
    }
}
