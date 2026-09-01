package it.made.cinema.Model.DTO;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
@EqualsAndHashCode
public class CarrelloDTO implements Serializable{
	private Integer id;
	private List<ListaOffertaDTO> listaOfferta;
	private String nomeCarta;
	private Double prezzoCarta;
	private Double prezzoFinale;
	private Integer punti;
}
