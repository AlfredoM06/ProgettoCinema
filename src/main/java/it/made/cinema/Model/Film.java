package it.made.cinema.Model;

import java.sql.Date;
import java.util.List;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
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
@Table(name="films")
public class Film {
	@Id 
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private Integer id;
	@NotEmpty
	@Column(length=50, nullable= false) 
	private String titolo;
	@NotEmpty
	@Column(length=50, nullable= false)
	private String distribuzione; 
	@NotEmpty
	@Column(nullable=false)
	private Date data_di_uscita;
	@NotEmpty
	@Column(length= 1500, nullable=false)
	private String descrizione; 
	@NotEmpty
	@Column(length=50, nullable=false)
	private String regista;
	@NotEmpty
	@Column(length=1500, nullable=false)
	private String cast;
	@NotEmpty
	@Column(nullable=false)
	private Integer durata;
	@NotEmpty
	@Column(length=50, nullable=false)
	private String formato;
	@NotEmpty
	@Column(length=500, nullable=false)
	private String lingue;
	@NotEmpty
	@Column(length=500, nullable=false, unique=true)
	private String img_cover;
	@NotEmpty
	@Column(length=500, nullable=false, unique=true)
	private String img_logo;
	@NotEmpty
	@Column(length=500, nullable=false, unique=true)
	private String img_poster;
	@NotEmpty
	@Column(nullable=false)
	private Double prezzo;
	@NotEmpty
	@Column(nullable=false)
	private Date scadenza;
	@OneToMany(mappedBy="film")
	private List<Gadget> gadgets;
	@ManyToMany()
	@JoinTable(name="films_generi", joinColumns=@JoinColumn(name="id_film"),inverseJoinColumns=@JoinColumn(name="id_genere"))
	private List<GenereFilm> generi;
}
