package it.made.cinema.Model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
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

    // id semplice autogenerato
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotNull
    @Column(nullable = false)
    private LocalTime orario;

    @NotNull
    @Column(nullable = false)
    private int nPrenotazioni;

    @NotNull
    private LocalDate dataProgrammazione;

    // ManyToOne con Sala
    @ManyToOne
    @JoinColumn(name = "id_sala")
    private Sala sala;

    // ManyToOne con Film
    @ManyToOne
    @JoinColumn(name = "id_film")
    private Film film;

    @OneToMany(mappedBy = "programmazioneFilm")
    private List<PostiOccupati> listaPostiOccupati;
}

