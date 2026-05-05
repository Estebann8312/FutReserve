package com.futreserve.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "canchas")
public class Cancha {

    @Id
    private String id;

    private String nombre;
    private String descripcion;
    private Double precioHora;
    private Integer capacidad;
    private String ubicacion;
    private Boolean disponible = true;
    private String imagenUrl;

    private LocalDateTime createdAt = LocalDateTime.now();
}
