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
public class FormFilmDTO implements Serializable{
	private Integer id;
	private String titolo;
	private String distribuzione;
	private String sinossi;
	private String regista;
	private String cast;
	private List<Integer> genere;
	private LocalDate dataUscita;
	private LocalDate scadenza;
	private Integer durata;
	private Double prezzo;
	private List<Integer> italiano;
	private List<Integer> inglese;
	private String imgCopertina;
	private String imgLocandina;
	private String imgLogo;
	private String imgPartnership;
	private String titoloPartnership;
	private Boolean partnership;
	private Boolean archiviato;
}

