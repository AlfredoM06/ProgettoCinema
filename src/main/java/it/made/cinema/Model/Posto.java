package it.made.cinema.Model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name="posti")
public class Posto {
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private Integer id;
	@NotNull 
	@NotEmpty
	private String tipo;
	@NotNull 
	@NotEmpty
	private boolean occupato;
	
	public Posto(){};
	
	public Posto(@NotNull @NotEmpty String tipo, @NotNull @NotEmpty boolean occupato) {
		super();
		this.tipo = tipo;
		this.occupato = occupato;
	}
	public String getTipo() {
		return tipo;
	}
	public void setTipo(String tipo) {
		this.tipo = tipo;
	}
	public boolean isOccupato() {
		return occupato;
	}
	public void setOccupato(boolean occupato) {
		this.occupato = occupato;
	}
	
	
	
}
