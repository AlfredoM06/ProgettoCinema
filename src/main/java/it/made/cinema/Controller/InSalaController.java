package it.made.cinema.Controller;

import it.made.cinema.Model.DTO.ListaFilmDTO;
import it.made.cinema.Model.Film;
import it.made.cinema.Model.GenereFilm;
import it.made.cinema.Model.DTO.ListaGenereDTO;
import it.made.cinema.Model.DTO.ListaProgDTO;
import it.made.cinema.Repository.IRepoFilm;
import it.made.cinema.Repository.IRepoGeneri;
import it.made.cinema.Service.PrezzoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
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
    @Autowired
    PrezzoService prezzoService;

    //dettagli di un film
    @GetMapping("/dettagli/{id}")
    public String dettFilm(@PathVariable("id") Integer id, Model model) {
        model.addAttribute("film", repoFilm.findById(id).get());
        return "filmDettaglio";
    }

    //index
    @GetMapping
    public String index(Model model) {
        List<Film> films = repoFilm.findAll();
        return "inSala";
    }

    //filtri per la pagina dell'insala e la lista intera
    @GetMapping("/ricerca")
    public @ResponseBody List<ListaFilmDTO> ricercaFilm(@RequestParam(name = "keyword", required = false) String searchKeyword, @RequestParam(name = "genere", required = false) List<Integer> idGenere) {
        List<Film> films = null;
        if (searchKeyword != null && !searchKeyword.isBlank()) {
            films = repoFilm.findByTitoloContainingOrRegistaContainingOrCastContainingOrDistribuzioneContaining(searchKeyword, searchKeyword, searchKeyword, searchKeyword);
        } else if (idGenere != null && !idGenere.isEmpty()) {
            films = repoFilm.findByGenereFilm(idGenere);
        } else {
            films = repoFilm.findAll();
        }
        List<ListaFilmDTO> filmsDTO = new ArrayList<>();
        for (Film film : films) {
            filmsDTO.add(new ListaFilmDTO(film.getId(), film.getTitolo(), film.getImg_poster()));
        }
        return filmsDTO;
    }

    //lista di generi da passare al fornt-end
    @GetMapping("/generi")
    public @ResponseBody List<ListaGenereDTO> listaGeneri() {
        List<GenereFilm> generi = repoGeneri.findAll();
        List<ListaGenereDTO> generiDTO = new ArrayList<>();
        for (GenereFilm genere : generi) {
            generiDTO.add(new ListaGenereDTO(genere.getId(), genere.getNome()));
        }
        return generiDTO;
    }

}
