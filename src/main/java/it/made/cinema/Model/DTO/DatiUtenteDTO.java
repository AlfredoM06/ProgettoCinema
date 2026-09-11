package it.made.cinema.Model.DTO;

import lombok.*;

import java.io.Serializable;
import java.time.LocalDate;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
@EqualsAndHashCode
public class DatiUtenteDTO implements Serializable {
    private String nome;
    private String cognome;
    private String username;
    private String email;
    private LocalDate dataNascita;
    private String password;
    private String vecchiaPassword;
    private String nTelefono;
    private String indirizzo;
    private String citta;
    private String cap;
}
