package it.made.cinema.Model.DTO;

import java.io.Serializable;
import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@NoArgsConstructor
@AllArgsConstructor
@Getter @Setter
@ToString @EqualsAndHashCode
public class ListaOffertaDTO implements Serializable {
	private Integer id;
	private String nome;
	private String genere;
	private String descrizione;
	private String imgBannerTop;
	private Double prezzo;
	private Double prezzoScontato;
	private LocalDate dataInizio;
	private Double valoreSconto;
}
