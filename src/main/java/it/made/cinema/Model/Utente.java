package it.made.cinema.Model;

import java.time.LocalDate;
import java.util.List;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
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
@Table(name="utenti")
public class Utente {
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private Integer id;
	@NotEmpty
	@Column(length=50, nullable=false)
	private String username;
	@NotEmpty
	@Column(length=50, nullable=false)
	private String nome;
	@NotEmpty
	@Column(length=50, nullable=false)
	private String cognome;
	@NotEmpty
	@Column(length=50, nullable=false)
	private String password;
	@NotEmpty
	@Column(length=70, nullable=false)
	private String email;
	@Column(nullable=false)
	private Boolean membership;//carta punti
	@NotEmpty
	@Column(nullable=false)
	private Integer puntiMembership;
	@Column
	private LocalDate acquistoMembership;
	@Column(nullable = false)
	private Boolean cartaRicaricabile;

	@Column
	private LocalDate dataAcquisto;

	@Column
	private LocalDate dataScadenza;
	@NotEmpty
	@Column
	private Integer utilizziCard;
	@NotEmpty
	@Column(nullable=false)
	private LocalDate dataNascita;
	@NotEmpty
	@Column
	private Integer annoUltimaMailCompleanno;
	@OneToMany(mappedBy="utente")
	private List<PostiOccupati> postiOccupati;
	@OneToMany(mappedBy="utente")
	private List<AcquistiGadget> acquistiGadget;
	@ManyToOne
	@JoinColumn(name ="id_ruolo")
	private Ruolo ruolo;
	@ManyToOne
	@JoinColumn(name ="id_nomeCarta")
	private NomeCarta nomeCarta;
	@OneToOne
	@JoinColumn(name="id_carello", referencedColumnName="id")
	private Carello carello;
}
