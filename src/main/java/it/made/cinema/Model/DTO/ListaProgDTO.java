package it.made.cinema.Model.DTO;

import jakarta.persistence.criteria.CriteriaBuilder;
import lombok.*;

import java.io.Serializable;
import java.time.LocalTime;

import it.made.cinema.Model.ProgrammazioneFilmKey;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
@EqualsAndHashCode
public class ListaProgDTO implements Serializable {

    //orario, sala, prezzo, formato, id
    private ProgrammazioneFilmKey id;
    private Integer id_film;
    private Integer id_sala;
    private Double prezzo;
    private String formato;
    private LocalTime orarioInizio;
    private LocalTime orarioFine;




}
