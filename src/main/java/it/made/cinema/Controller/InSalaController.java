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
  //  @Autowired
  //  private IRepoGeneri repoGeneri;

   /* @GetMapping
    public String listaFilm(Model model){
        List<Film> films = repoFilm.findByArchiviatoFalse();
        model.addAttribute("films", films);
        return "inSala";
    }*/

    @GetMapping("/dettagli/{id}")
    public String dettFilm(@PathVariable("id") Integer id, Model model){
        model.addAttribute("film", repoFilm.findById(id).get());
        System.out.println(repoFilm.toString());
        return "filmDettaglio";
    }
    //aspetta che finisca la pagina
    @GetMapping
   /*public String ricercaPerGenere(@RequestParam(name= "genere", required=false) List<Integer> idGenere, Model model) {
    	if (idGenere != null && !idGenere.isEmpty()) {
    		model.addAttribute("films", repoFilm.findByGenereFilm(idGenere));
    	}
    	else {
    		model.addAttribute("films", repoFilm.findAll());
    		}
    	return "inSala";
    }*/
    public String index(@RequestParam(name= "keyword", required =false) String searchKeyword,@RequestParam(name="genere", required=false) List<Integer> idGenere, Model model) {
    	List<Film> films = null;
    	if (searchKeyword != null && !searchKeyword.isBlank()) {
    		films = repoFilm.findByTitoloContainingOrRegistaContainingOrCastContainingOrDistribuzioneContaining(searchKeyword, searchKeyword, searchKeyword, searchKeyword);
    	} else if(idGenere != null && !idGenere.isEmpty()){
    		films = repoFilm.findByGenereFilm(idGenere);
    	}
    	else {
    		films = repoFilm.findAll();
    	}
    	model.addAttribute("films", films);
    	model.addAttribute("noResult", films.isEmpty());
    	model.addAttribute("preloadSearch", searchKeyword);
    	model.addAttribute("preloadGenere", idGenere);
    	return "inSala";
    }

}
