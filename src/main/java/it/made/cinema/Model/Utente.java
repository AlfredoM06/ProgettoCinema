package it.made.cinema.Model;

import java.time.LocalDate;
import java.util.List;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;
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
	@NotEmpty
	@Column(length=50, nullable=false)
	private String ruolo;
	@Column(nullable=false)
	private Boolean membership;//carta punti
	@NotEmpty
	@Column(nullable=false)
	private Integer puntiMembership;
	@Column(nullable = false)
	private Boolean cartaRicaricabile;
	@NotEmpty
	@Column(length=100,nullable=false)
	private String nomeCarta;
	@NotEmpty
	@Column(nullable=false)
	private LocalDate dataAcquisto;
	@NotEmpty
	@Column(nullable=false)
	private LocalDate dataScadenza;
	@NotEmpty
	@Column(nullable=false)
	private Integer utilizziCard;
	@NotEmpty
	@Column(nullable=false)
	private LocalDate dataNascita;
	@NotEmpty
	@Column
	private Integer annoUltimaMailCompleanno;
	@OneToMany(mappedBy="utente")
	private List<PostiOccupati> postiOccupati;
}
