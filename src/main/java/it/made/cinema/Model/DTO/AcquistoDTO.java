package it.made.cinema.Model.DTO;

import it.made.cinema.Model.ProgrammazioneFilm;
import lombok.*;

import java.io.Serializable;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
@EqualsAndHashCode
public class AcquistoDTO implements Serializable {

    Integer id_film;
    Integer id_utente;
    PostiDTO postiDTO;
    Integer id_programmazione;
}