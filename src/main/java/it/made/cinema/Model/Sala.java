package it.made.cinema.Model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name="sale")
public class Sala {
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private Integer id;
	@NotNull 
	@NotEmpty
	private String tipo;
	@NotNull 
	@NotEmpty
	private Integer numero_posti;
	
	public Sala() {};
	
	public Sala(@NotNull @NotEmpty String tipo, @NotNull @NotEmpty Integer numero_posti) {
		super();
		this.tipo = tipo;
		this.numero_posti = numero_posti;
	}
	public String getTipo() {
		return tipo;
	}
	public void setTipo(String tipo) {
		this.tipo = tipo;
	}
	public Integer getNumero_posti() {
		return numero_posti;
	}
	public void setNumero_posti(Integer numero_posti) {
		this.numero_posti = numero_posti;
	}
	
	
}
