package it.made.cinema.Controller;

import java.sql.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import it.made.cinema.Model.Film;
import it.made.cinema.Repository.IRepoFilm;

@Controller
@RequestMapping("/prossimamente")
public class ProssimamenteController {

    //c'è la pagina
    //lista film, dettagli film, log in per la prenotazione,
	@Autowired
	private IRepoFilm repoFilm;
	@GetMapping
	public String listaProssimamente(Model model) {
		//bisogna inserire un filtro con data odierna e top5 per numero prenotazioni
		//List<Film> lsitafilm = repoFilm.findAll();
		//collegare il filtro a thymeleaf cosi da far generare le card con già i film filtrati
		List<Film> risultatoRicerca = repoFilm.findByAllDate();
		model.addAttribute("filmProssimamente", risultatoRicerca);
		//model.addAttribute(lsitafilm);
		System.out.println(risultatoRicerca.size());
		return "prossimamente";
	}
	
	@GetMapping("/dettagli/{id}")
	public String dettagliProssimamente(@PathVariable("id") Integer id, Model model) {
		model.addAttribute("film", repoFilm.findById(id).get());
		return "filmDettaglio";
	}



}
