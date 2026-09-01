package it.made.cinema.Model;

import java.time.LocalDate;
import java.util.List;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.ColumnDefault;

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
	@Column()
	private Boolean membership;//carta punti
	@Column(nullable = false, columnDefinition = "INT DEFAULT 0")
	private Integer puntiMembership = 0;
	@Column
	private LocalDate acquistoMembership;
	@Column()
	private Boolean cartaRicaricabile;
	@Column
	private LocalDate dataAcquisto;
	@Column
	private LocalDate dataScadenza;
	@Column()
	private Integer utilizziCard;
	@Column(nullable=false)
	private LocalDate dataNascita;
	@Column()
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
	@JoinColumn(name="id_carrello", referencedColumnName="id")
	private Carrello carrello;
}
