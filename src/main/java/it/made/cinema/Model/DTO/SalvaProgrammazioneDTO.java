package it.made.cinema.Model.DTO;

import lombok.*;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalTime;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
@EqualsAndHashCode
public class SalvaProgrammazioneDTO implements Serializable {

    private Integer idFilm;
    private Integer idSala;
    private LocalDate data;
    private LocalTime orario;

}