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
public class RegistrazioneDTO implements Serializable {
    private String username;
    private String email;
    private String nome;
    private String cognome;
    private String password;
    private LocalDate dataNascita;
}
