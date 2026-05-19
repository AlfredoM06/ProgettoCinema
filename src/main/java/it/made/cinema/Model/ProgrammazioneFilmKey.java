package it.made.cinema.Model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.io.Serializable;

//@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter @Setter
@ToString @EqualsAndHashCode
@Table(name="chiaveTabPonte")
@Embeddable
public class ProgrammazioneFilmKey implements Serializable {

    @Column(name = "id_sala")
    private Integer idSala;

    @Column(name = "id_posto")
    private Integer idPosto;

    @Column(name = "id_film")
    private Integer idFilm;

}
