package it.made.cinema.Model.DTO;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalTime;

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
public class OfferteDTO implements Serializable{
	private Integer idAcquisto;
	private String nome;
	private String imgBanner;
	private LocalDate dataAcquisto;
}
