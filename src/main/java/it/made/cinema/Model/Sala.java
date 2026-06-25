package it.made.cinema.Model;

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
@Table(name="sale")
public class Sala {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@NotEmpty
	@Column(length = 50, nullable = false)
	private String tipo;

	@NotNull
	@Column(nullable = false)
	private Integer numero_posti;

	@OneToMany(mappedBy = "sala")
	private List<Posto> posti;

	// relazione con programmazione
	@OneToMany(mappedBy = "sala")
	private List<ProgrammazioneFilm> programmazioni;
}
