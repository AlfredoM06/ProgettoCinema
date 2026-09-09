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
public class ProfiloDTO implements Serializable {
           private Integer id;
           private String nome;
           private String cognome;
           private String email;
           private String nTelefono;
           private String indirizzo;
           private String citta;
           private String cap;
           private LocalDate dataNascita;
           private Boolean membership;
           private Integer puntiMembership;
}
