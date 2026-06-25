package it.made.cinema.Model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.sql.Date;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter @Setter
@ToString @EqualsAndHashCode
@Table(name = "programmazioneDeiFilm")
public class ProgrammazioneFilm {
    //id composito
    @EmbeddedId
    ProgrammazioneFilmKey id;

    // orario
    @NotEmpty
    @Column(nullable = false)
    private LocalTime orario;
    
    // prenotazioni
    @NotEmpty
    @Column(nullable = false)
    private int nPrenotazioni;

    // 1aM con sala
    @ManyToOne
    @MapsId("idSala")
    @JoinColumn(name = "id_sala")
    Sala sala;
    
    //Data delle programmazione
    private LocalDate dataProgrammazione;
   
    //1aM film
    @ManyToOne
    @MapsId("idFilm")
    @JoinColumn(name = "id_film")
    Film film;
    
    // lista posti occupati
    @OneToMany(mappedBy = "programmazioneFilm")
    private List<PostiOccupati> listaPostiOccupati;
}
