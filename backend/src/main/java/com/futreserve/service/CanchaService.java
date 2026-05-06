package com.futreserve.service;

import com.futreserve.dto.CanchaRequest;
import com.futreserve.model.Cancha;
import com.futreserve.repository.CanchaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CanchaService {

    private final CanchaRepository canchaRepository;

    public List<Cancha> getAll() {
        return canchaRepository.findAll();
    }

    public List<Cancha> getByOwnerId(String ownerId) {
        return canchaRepository.findByOwnerId(ownerId);
    }

    public Cancha getById(String id) {
        return canchaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cancha no encontrada con id: " + id));
    }

    public Cancha create(CanchaRequest request) {
        Cancha cancha = new Cancha();
        cancha.setNombre(request.getNombre());
        cancha.setNumeroCancha(request.getNumeroCancha());
        cancha.setDescripcion(request.getDescripcion());
        cancha.setPrecioHora(request.getPrecioHora());
        cancha.setDuracion(request.getDuracion() != null ? request.getDuracion() : 1);
        cancha.setCapacidad(request.getCapacidad());
        cancha.setUbicacion(request.getUbicacion());
        cancha.setDisponible(request.getDisponible() != null ? request.getDisponible() : true);
        cancha.setImagenUrl(request.getImagenUrl());
        cancha.setOwnerId(request.getOwnerId());
        return canchaRepository.save(cancha);
    }

    public Cancha update(String id, CanchaRequest request) {
        Cancha cancha = getById(id);
        cancha.setNombre(request.getNombre());
        cancha.setNumeroCancha(request.getNumeroCancha());
        cancha.setDescripcion(request.getDescripcion());
        cancha.setPrecioHora(request.getPrecioHora());
        cancha.setDuracion(request.getDuracion() != null ? request.getDuracion() : 1);
        cancha.setCapacidad(request.getCapacidad());
        cancha.setUbicacion(request.getUbicacion());
        cancha.setDisponible(request.getDisponible() != null ? request.getDisponible() : cancha.getDisponible());
        cancha.setImagenUrl(request.getImagenUrl());
        cancha.setOwnerId(request.getOwnerId());
        return canchaRepository.save(cancha);
    }

    public void delete(String id) {
        if (!canchaRepository.existsById(id)) {
            throw new RuntimeException("Cancha no encontrada con id: " + id);
        }
        canchaRepository.deleteById(id);
    }
}
