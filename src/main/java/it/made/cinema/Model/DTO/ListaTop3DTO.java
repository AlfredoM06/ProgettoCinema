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
public class ListaTop3DTO implements Serializable {
    private Integer id;
    private String nome;
    private LocalDate dataInizio;
    private String imgBannerTopOfferte;
}
