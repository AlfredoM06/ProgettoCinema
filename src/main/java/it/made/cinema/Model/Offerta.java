package it.made.cinema.Model;

import java.math.BigDecimal;
import java.time.LocalDate;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;
import lombok.*;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter @Setter
@ToString @EqualsAndHashCode
@Table(name="offerte")
public class Offerta {
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private Integer id;
	@NotEmpty
	@Column(length=100, nullable=false)
	private String nome;
	@NotEmpty
	@Column(length=50, nullable=false)
	private String genere;
	@NotEmpty
	@Column(nullable=false)
	private LocalDate dataInizio;
	@NotEmpty
	@Column(nullable=false)
	private LocalDate dataScadenza;
	@NotEmpty
	@Column(length=500, nullable=false)
	private String descrizione;
	@Column
	private BigDecimal prezzo;
	@NotEmpty
	@Column(length=1000, nullable=false)
	private String imgBanner;
	@NotEmpty
	@Column(length=1000, nullable=false)
	private String imgDettaglio;
	@ManyToOne
	@JoinColumn(name="id_film", referencedColumnName="id")
	private Film film;
}
