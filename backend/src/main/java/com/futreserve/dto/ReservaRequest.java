package com.futreserve.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class ReservaRequest {

    @NotBlank(message = "El ID de la cancha es requerido")
    private String canchaId;

    @NotNull(message = "La fecha es requerida")
    private LocalDate fecha;

    @NotBlank(message = "La hora de inicio es requerida")
    private String horaInicio;

    @NotBlank(message = "La hora de fin es requerida")
    private String horaFin;
}
