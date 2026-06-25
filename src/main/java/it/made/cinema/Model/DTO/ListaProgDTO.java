package it.made.cinema.Model.DTO;

import lombok.*;

import java.io.Serializable;
import java.time.LocalTime;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
@EqualsAndHashCode
public class ListaProgDTO implements Serializable {

    //orario, sala, prezzo, formato, id
    private Integer id;
    private Integer id_film;
    private Integer id_sala;
    private Double prezzo;
    private String formato;
    private LocalTime orarioInizio;
    private LocalTime orarioFine;




}
