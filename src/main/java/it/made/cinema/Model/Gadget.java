package it.made.cinema.Model;

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
@Table(name="gadgets")
public class Gadget {
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private Integer id;
	@NotEmpty
	@Column(length= 100, nullable= false, unique= true)
	private String nome;
	@NotEmpty
	@Column(length= 1500, nullable= false)
	private String descrizione; 
	@NotEmpty
	@Column(length= 150, nullable= false, unique= true)
	private String img; 
	@NotEmpty
	@Column(nullable= false)
	private Double prezzo; 
	@NotEmpty
	@Column(nullable= false)
	private Integer quantita;
	@NotEmpty
	@Column(length= 150, nullable= false, unique= true)
	private String img_banner;
	@ManyToOne
	@JoinColumn(name="id_film", referencedColumnName="id")
	private Film film;
}
