package it.made.cinema.Model.DTO;

import lombok.*;

import java.io.Serializable;

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
    private String password;
}
