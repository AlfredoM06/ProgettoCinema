package it.made.cinema.Model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name="gadgets")
public class Gadget {
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private Integer id;
	@NotNull 
	@NotEmpty
	private String nome;
	@NotNull 
	@NotEmpty
	private String descrizione;
	@NotNull 
	@NotEmpty
	private String img;
	@NotNull 
	@NotEmpty
	private Double prezzo;
	@NotNull 
	@NotEmpty
	private Integer quantita;
	@NotNull 
	@NotEmpty
	private String img_banner;
	
	public String getNome() {
		return nome;
	}

	public void setNome(String nome) {
		this.nome = nome;
	}

	public String getDescrizione() {
		return descrizione;
	}

	public void setDescrizione(String descrizione) {
		this.descrizione = descrizione;
	}

	public String getImg() {
		return img;
	}

	public void setImg(String img) {
		this.img = img;
	}

	public Double getPrezzo() {
		return prezzo;
	}

	public void setPrezzo(Double prezzo) {
		this.prezzo = prezzo;
	}

	public Integer getQuantita() {
		return quantita;
	}

	public void setQuantita(Integer quantita) {
		this.quantita = quantita;
	}

	public String getImg_banner() {
		return img_banner;
	}

	public void setImg_banner(String img_banner) {
		this.img_banner = img_banner;
	}

	public Gadget() {};
	
	public Gadget(@NotNull @NotEmpty String nome, @NotNull @NotEmpty String descrizione, @NotNull @NotEmpty String img,
			@NotNull @NotEmpty Double prezzo, @NotNull @NotEmpty Integer quantita,
			@NotNull @NotEmpty String img_banner) {
		super();
		this.nome = nome;
		this.descrizione = descrizione;
		this.img = img;
		this.prezzo = prezzo;
		this.quantita = quantita;
		this.img_banner = img_banner;
	}
	
	
	
}
