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
public class FilmDTO implements Serializable {
    private Integer id;
    private String titolo;
    private String distribuzione;
    private LocalDate dataDiUscita;
    private String descrizione;
    private String regista;
    private String cast;
    private Integer durata;
    private String img_poster;
    private Double prezzo;
    private LocalDate scadenza;
    private List<ListaOffertaDTO> offerte;
    private List<ListaGenereDTO> generi;
    private List<ListaProgDTO> tutte;
    private Map<LocalDate, List<ListaProgDTO>> programmazioni;
    private List<String> formati;
    private List<String> lingue;
}
