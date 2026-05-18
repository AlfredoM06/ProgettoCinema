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
@Table(name="utenti")
public class Utente {
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private Integer id;
	@NotEmpty
	@Column(length=50, nullable=false, unique=true)
	private String username;
	@NotEmpty
	@Column(length=50, nullable=false)
	private String password;
	@NotEmpty
	@Column(length=70, nullable=false, unique=true)
	private String email;
	@NotEmpty
	@Column(length=50, nullable=false)
	private String ruolo;
	@NotEmpty
	@Column(length=50, nullable=false)
	private String membership;
	
}
