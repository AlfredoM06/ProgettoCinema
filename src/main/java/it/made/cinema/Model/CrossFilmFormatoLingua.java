package it.made.cinema.Model;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter @Setter
@ToString @EqualsAndHashCode
@Table(name = "crossFormatoLingua")
public class CrossFilmFormatoLingua {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;
	
	@ManyToOne
	@JoinColumn(name="id_film")
	private Film film;
	
	@ManyToOne
	@JoinColumn(name="id_formato")
	private Formato formato;
	
	@ManyToOne
	@JoinColumn(name="id_lingua")
	private Lingua lingua;
}
