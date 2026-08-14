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
public class GestioneOfferteDTO implements Serializable {
    //nome, genere, descrizione, data ini, data scad, prezzo, tutte le img
    private Integer id;
    private String nome;
    private String genere;
    private String descrizione;
    private LocalDate dataInizio;
    private LocalDate dataScadenza;
    private Double prezzo;
    private String imgBanner;
    private String imgDettaglio;
    private String imgBannerTopOfferte;

}
