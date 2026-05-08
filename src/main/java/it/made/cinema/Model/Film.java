package it.made.cinema.Model;

import java.sql.Date;


import jakarta.persistence.*;
import jakarta.validation.constraints.*;

@Entity
@Table(name="films")
public class Film {
	@Id 
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private Integer id;
	@NotNull 
	@NotEmpty
	private String titolo;
	@NotNull 
	@NotEmpty
	private String distribuzione;
	@NotNull 
	@NotEmpty
	private Date data_di_uscita;
	@NotNull 
	@NotEmpty
	private String descrizione;
	@NotNull 
	@NotEmpty
	private String regista;
	@NotNull 
	@NotEmpty
	private String cast;
	@NotNull 
	@NotEmpty
	private Integer durata;
	@NotNull 
	@NotEmpty
	private String formato;
	@NotNull 
	@NotEmpty
	private String lingue;
	@NotNull 
	@NotEmpty
	private String img_cover;
	@NotNull 
	@NotEmpty
	private String img_logo;
	@NotNull 
	@NotEmpty
	private String img_poster;
	@NotNull 
	@NotEmpty
	private Double prezzo;
	@NotNull 
	@NotEmpty
	private Date scadenza;
	
	public Film() {};
	public Film(String titolo, String distribuzione, Date data_di_uscita, String descrizione, String regista,
			String cast, Integer durata, String formato, String lingue, String img_cover, String img_logo,
			String img_poster, Double prezzo, Date scadenza) {
		super();
		this.titolo = titolo;
		this.distribuzione = distribuzione;
		this.data_di_uscita = data_di_uscita;
		this.descrizione = descrizione;
		this.regista = regista;
		this.cast = cast;
		this.durata = durata;
		this.formato = formato;
		this.lingue = lingue;
		this.img_cover = img_cover;
		this.img_logo = img_logo;
		this.img_poster = img_poster;
		this.prezzo = prezzo;
		this.scadenza = scadenza;
	}
	public String getTitolo() {
		return titolo;
	}
	public void setTitolo(String titolo) {
		this.titolo = titolo;
	}
	public String getDistribuzione() {
		return distribuzione;
	}
	public void setDistribuzione(String distribuzione) {
		this.distribuzione = distribuzione;
	}
	public Date getData_di_uscita() {
		return data_di_uscita;
	}
	public void setData_di_uscita(Date data_di_uscita) {
		this.data_di_uscita = data_di_uscita;
	}
	public String getDescrizione() {
		return descrizione;
	}
	public void setDescrizione(String descrizione) {
		this.descrizione = descrizione;
	}
	public String getRegista() {
		return regista;
	}
	public void setRegista(String regista) {
		this.regista = regista;
	}
	public String getCast() {
		return cast;
	}
	public void setCast(String cast) {
		this.cast = cast;
	}
	public Integer getDurata() {
		return durata;
	}
	public void setDurata(Integer durata) {
		this.durata = durata;
	}
	public String getFormato() {
		return formato;
	}
	public void setFormato(String formato) {
		this.formato = formato;
	}
	public String getLingue() {
		return lingue;
	}
	public void setLingue(String lingue) {
		this.lingue = lingue;
	}
	public String getImg_cover() {
		return img_cover;
	}
	public void setImg_cover(String img_cover) {
		this.img_cover = img_cover;
	}
	public String getImg_logo() {
		return img_logo;
	}
	public void setImg_logo(String img_logo) {
		this.img_logo = img_logo;
	}
	public String getImg_poster() {
		return img_poster;
	}
	public void setImg_poster(String img_poster) {
		this.img_poster = img_poster;
	}
	public Double getPrezzo() {
		return prezzo;
	}
	public void setPrezzo(Double prezzo) {
		this.prezzo = prezzo;
	}
	public Date getScadenza() {
		return scadenza;
	}
	public void setScadenza(Date scadenza) {
		this.scadenza = scadenza;
	}
	
}
