package it.made.cinema.Model.DTO;

import lombok.*;

import java.io.Serializable;
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
@EqualsAndHashCode
public class BigliettoAcquistatoDTO implements Serializable {
    Double prezzoBiglietto;
    String posizione;
    Integer tipo;
}
