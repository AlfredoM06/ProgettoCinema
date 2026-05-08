package it.made.cinema.Model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name="utenti")
public class Utente {
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private Integer id;
	@NotNull 
	@NotEmpty
	private String username;
	@NotNull 
	@NotEmpty
	private String password;
	@NotNull 
	@NotEmpty
	private String email;
	@NotNull 
	@NotEmpty
	private String ruolo;
	@NotNull 
	@NotEmpty
	private String membership;
	
	public Utente() {};
	
	public Utente(@NotNull @NotEmpty String username, @NotNull @NotEmpty String password,
			@NotNull @NotEmpty @NotNull @NotEmpty String email, @NotNull @NotEmpty String ruolo, @NotNull @NotEmpty String membership) {
		super();
		this.username = username;
		this.password = password;
		this.email = email;
		this.ruolo = ruolo;
		this.membership = membership;
	}
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public @NotNull @NotEmpty String getEmail() {
		return email;
	}
	public void setEmail(@NotNull @NotEmpty String email) {
		this.email = email;
	}
	public String getRuolo() {
		return ruolo;
	}
	public void setRuolo(String ruolo) {
		this.ruolo = ruolo;
	}
	public String getMembership() {
		return membership;
	}
	public void setMembership(String membership) {
		this.membership = membership;
	}
	
	
}
