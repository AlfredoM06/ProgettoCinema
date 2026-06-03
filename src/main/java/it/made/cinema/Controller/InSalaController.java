package it.made.cinema.Controller;

import it.made.cinema.Model.Film;
import it.made.cinema.Model.GenereFilm;
import it.made.cinema.Repository.IRepoFilm;
import it.made.cinema.Repository.IRepoGeneri;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;
import java.util.Optional;

@Controller
@RequestMapping("/inSala")
public class InSalaController {
    //lista di film
    //barra di ricerca
    //da vedere come si fa
    @Autowired
    private IRepoFilm repoFilm;
    @Autowired
    private IRepoGeneri repoGeneri;

    @GetMapping
    public String listaFilm(Model model){
        List<Film> films = repoFilm.findByArchiviatoFalse();
        model.addAttribute("films", films);
        return "inSala";
    }

    @GetMapping("/dettagli/{id}")
    public String dettFilm(@PathVariable("id") Integer id, Model model){
        model.addAttribute("film", repoFilm.findById(id).get());
        return "filmDettaglio";
    }
    //aspetta che finisca la pagina
   /* @GetMapping
    public String index(@RequestParam(name= "genere", required=false) String ricercaGenere, Model model) {
    	List<GenereFilm> films;
    	if (ricercaGenere != null) {
    		films= repoGeneri.findByGenereFilmContaining(ricercaGenere);
    	}
    	else {
    		films= repoGeneri.findAll();}
    	return "";
    }*/
    public String index(@RequestParam(name= "keyword", required =false) String searchKeyword, Model model) {
    	List<Film> films;
    	if (searchKeyword != null) {
    		films = repoFilm.findByTitoloContainingOrRegistaContainingOrCastContainingOrDistribuzioneContaining(searchKeyword, searchKeyword, searchKeyword, searchKeyword);
    	} else {
    		films=repoFilm.findAll();
    	}
    	if (films.isEmpty()) {
    		return "Pagina errore";
    	}
    	model.addAttribute("films", films);
    	model.addAttribute("preloadSearch", searchKeyword);
    	return "inSala";
    }

}
