package it.made.cinema.Model;

import java.io.Serializable;
import java.sql.Date;
import java.time.LocalDate;
import java.util.List;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import javax.annotation.processing.Generated;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter @Setter
@ToString @EqualsAndHashCode
@Table(name="films")
public class Film implements Serializable {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@NotEmpty
	@Column(length = 50, nullable = false)
	private String titolo;

	@NotEmpty
	@Column(length = 50, nullable = false)
	private String distribuzione;

	@NotNull
	@Column(nullable = false)
	private LocalDate data_di_uscita;

	@NotEmpty
	@Column(length = 1500, nullable = false)
	private String descrizione;

	@NotEmpty
	@Column(length = 50, nullable = false)
	private String regista;

	@NotEmpty
	@Column(length = 1500, nullable = false)
	private String cast;

	@NotNull
	@Column(nullable = false)
	private Integer durata;

	@NotEmpty
	@Column(length = 50, nullable = false)
	private String formato;

	@NotEmpty
	@Column(length = 500, nullable = false)
	private String lingue;

	@NotEmpty
	@Column(length = 500, nullable = false)
	private String img_cover;

	@NotEmpty
	@Column(length = 500, nullable = false)
	private String img_logo;

	@NotEmpty
	@Column(length = 500, nullable = false)
	private String img_poster;

	@NotNull
	@Column(nullable = false)
	private Double prezzo;

	@NotNull
	@Column(nullable = false)
	private LocalDate scadenza;

	@NotNull
	@Column(nullable = false)
	private boolean archiviato;

	@OneToMany(mappedBy="film")
	private List<Offerta> offerte;

	@ManyToMany(fetch = FetchType.EAGER)
	@JoinTable(name="films_generi", joinColumns=@JoinColumn(name="id_film"),inverseJoinColumns=@JoinColumn(name="id_genere"))
	private List<GenereFilm> generi;

	@OneToOne(cascade=CascadeType.ALL)
	@JoinColumn(name="id_partnership", referencedColumnName="id")
	private Partnership partnership;

	//relazione con programmazione
	@OneToMany(mappedBy = "film")
	private List<ProgrammazioneFilm> programmazioni;

}
