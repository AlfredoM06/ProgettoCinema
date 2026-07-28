package it.made.cinema.Model.DTO;

import it.made.cinema.Model.ProgrammazioneFilm;
import lombok.*;

import java.io.Serializable;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
@EqualsAndHashCode
public class AcquistoDTO implements Serializable {

    Integer id_film;
    Integer id_utente;
    List<PostiDTO> listaPostiDTO;
    Integer id_programmazione;
    Boolean acquisto;
}