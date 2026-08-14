package it.made.cinema.Model.DTO;
import it.made.cinema.Model.GenereFilm;
import it.made.cinema.Model.Offerta;
import it.made.cinema.Model.ProgrammazioneFilm;
import lombok.*;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
@EqualsAndHashCode
public class SelectFilmDTO implements Serializable{
    private int id;
    private String titolo;
    private Integer durata;
}
