package it.made.cinema.Model;

import jakarta.persistence.*;
import jakarta.persistence.criteria.CriteriaBuilder;
import lombok.*;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter @Setter
@ToString @EqualsAndHashCode
@Table(name="postiOccupati")
public class PostiOccupati {

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;
    @Column
    private Boolean occupato;
    //relazione con tabPonte
    @ManyToOne
    @JoinColumn(name = "id_programmazioneFilm", nullable = false)
    private ProgrammazioneFilm programmazioneFilm;
    @Column
    private String posizione;
    @ManyToOne
    @JoinColumn(name = "id_utente")
    private Utente utente;
    @Column
    private Integer tipoPosto;
}
