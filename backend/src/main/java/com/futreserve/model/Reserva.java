package com.futreserve.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "reservas")
public class Reserva {

    @Id
    private String id;

    private String usuarioId;
    private String canchaId;
    private LocalDate fecha;
    private String horaInicio;
    private String horaFin;

    // PENDIENTE, CONFIRMADA, CANCELADA
    private String estado = "PENDIENTE";

    private Double total;

    private LocalDateTime createdAt = LocalDateTime.now();
}
