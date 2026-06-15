package it.made.cinema.Model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;

import java.sql.Date;
import java.util.List;

@Entity
@Table(name = "programmazioneDeiFilm")
public class ProgrammazioneFilm {
    //id composito
    @EmbeddedId
    ProgrammazioneFilmKey id;

    // orario
    @NotEmpty
    @Column(nullable = false)
    private String orario;//da aggiustare in formato orario qui e su sql
    // prenotazioni
    @NotEmpty
    @Column(nullable = false)
    private int nPrenotazioni;

    // 1aM con posto
   /* @ManyToOne
    @MapsId("idPosto")
    @JoinColumn(name = "id_posto")
    Posto posto;*/
    // 1aM con sala
    @ManyToOne
    @MapsId("idSala")
    @JoinColumn(name = "id_sala")
    Sala sala;
    //1aM film
    @ManyToOne
    @MapsId("idFilm")
    @JoinColumn(name = "id_film")
    Film film;
    // lista posti occupati
    @OneToMany(mappedBy = "programmazioneFilm")
    private List<PostiOccupati> listaPostiOccupati;
}
