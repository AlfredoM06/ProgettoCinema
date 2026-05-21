package it.made.cinema.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import it.made.cinema.Model.Film;
import it.made.cinema.Repository.IRepoFilm;

@Controller
@RequestMapping("/prossimamente")
public class ProssimamenteController {

    //c'è la pagina
    //lista film, dettagli film, log in per la prenotazione,
	@Autowired
	private IRepoFilm RepoFilm;
	@GetMapping
	private String listaProssimamente(Model model) {
		List<Film> listaProssimamente = RepoFilm.findAll();
		//bisogna inserire un filtro con data odierna e top5 per numero prenotazioni
		
		return "suca";
	}
}
