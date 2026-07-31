package it.made.cinema.Model.DTO;
import it.made.cinema.Model.GenereFilm;
import lombok.*;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
@EqualsAndHashCode
public class ListaFilmRecentiDTO {
    private Integer id;
    private String titolo;
    private String img_poster;
    private LocalDate dataDiUscita;
    private String descrizione;
    private Integer durata;
    private String img_cover;
    private String img_logo;
    private List<ListaGenereDTO> generi;
}
