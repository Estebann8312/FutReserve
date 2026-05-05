package com.futreserve.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CanchaRequest {

    @NotBlank(message = "El nombre es requerido")
    private String nombre;

    private String descripcion;

    @NotNull(message = "El precio por hora es requerido")
    private Double precioHora;

    private Integer capacidad;

    private String ubicacion;

    private Boolean disponible = true;

    private String imagenUrl;
}
