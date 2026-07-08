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
public class PostiOccupatiDTO implements Serializable {
	private Integer id;
	private String titolo;
	private LocalTime inizio;
	private LocalTime fine;
	private LocalDate giorno;
	private Integer sala;
	private String posto;
}
