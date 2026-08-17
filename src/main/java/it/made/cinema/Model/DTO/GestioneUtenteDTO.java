package it.made.cinema.Model.DTO;

import it.made.cinema.Model.Ruolo;
import lombok.*;

import java.io.Serializable;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
@EqualsAndHashCode
public class GestioneUtenteDTO implements Serializable {
    //nome, cognome, email, ruolo
    private Integer idRuolo;
    private Integer id;
    private String nome;
    private String cognome;
    private String email;
}
