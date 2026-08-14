package it.made.cinema.Model.DTO;

import lombok.*;

import java.io.Serializable;
import java.time.LocalDate;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
@EqualsAndHashCode
public class ArchivioProgrammazioniDTO implements Serializable {

    Integer idFilm;
    Integer idSala;
    String titolo;
    String nomeSala;
    LocalDate data;

}
