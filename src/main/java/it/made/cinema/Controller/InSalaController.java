package it.made.cinema.Controller;

import it.made.cinema.Model.*;
import it.made.cinema.Model.DTO.*;
import it.made.cinema.Repository.IRepoFilm;
import it.made.cinema.Repository.IRepoGeneri;
import it.made.cinema.Service.PostiService;
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
    @Autowired
    PostiService postiService;

    //index
    @GetMapping
    public String index(Model model) {
        List<Film> films = repoFilm.findAll();
        return "inSala";
    }

    //dettagli di un film
    @GetMapping("/dettagli/{id}")
    private String dettagliHome(@PathVariable("id") Integer id, Model model) {
        System.out.println("questo è l'id del film: " + id);
        Film film = repoFilm.findById(id).get();

        FilmDTO filmDTO = new FilmDTO();
        filmDTO.setId(id);
        filmDTO.setCast(film.getCast());
        filmDTO.setDescrizione(film.getDescrizione());
        filmDTO.setDurata(film.getDurata());
        filmDTO.setDistribuzione(film.getDistribuzione());
        filmDTO.setDataDiUscita(film.getDataDiUscita());
        filmDTO.setPrezzo(film.getPrezzo());
        filmDTO.setRegista(film.getRegista());
        filmDTO.setTitolo(film.getTitolo());
        filmDTO.setImg_poster(film.getImg_poster());
        filmDTO.setScadenza(film.getScadenza());
        List<ListaOffertaDTO> listaOfferte = new ArrayList<>();
        for (Offerta o : film.getOfferte()){
            ListaOffertaDTO offerta = new ListaOffertaDTO();
            offerta.setId(o.getId());
            offerta.setDescrizione(o.getDescrizione());
            offerta.setNome(o.getNome());
            offerta.setGenere(o.getGenere());
            offerta.setImg_banner(o.getImgBanner());
            listaOfferte.add(offerta);
        }
        filmDTO.setOfferte(listaOfferte);
        List<ListaGenereDTO> listaGeneri = new ArrayList<>();
        for (GenereFilm g : film.getGeneri()){
            ListaGenereDTO genere = new ListaGenereDTO();
            genere.setId(g.getId());
            genere.setNome(g.getNome());
            listaGeneri.add(genere);
        }
        filmDTO.setGeneri(listaGeneri);
        List<ListaProgDTO> listaProgrammazioni = new ArrayList<>();
        for (ProgrammazioneFilm p : film.getProgrammazioni()){
            ListaProgDTO programmazione = new ListaProgDTO();
            programmazione.setId(p.getId());
            programmazione.setPrezzo(film.getPrezzo());
            programmazione.setFormato(p.getSala().getFormato());
            programmazione.setId_film(film.getId());
            programmazione.setId_sala(p.getSala().getId());
            programmazione.setOrarioInizio(p.getOrario());
            programmazione.setOrarioFine(p.getOrario().plusMinutes(p.getFilm().getDurata() + 30));
            listaProgrammazioni.add(programmazione);
        }
        filmDTO.setProgrammazioni(listaProgrammazioni);
        List<String> lingue = new ArrayList<>();
        List<String> formati = new ArrayList<>();
        for (CrossFilmFormatoLingua c : film.getCrossFilmFormatoLingua()){
            if (!lingue.contains(c.getLingua().getNome())){
                lingue.add(c.getLingua().getNome());
            }
            if (!formati.contains(c.getFormato().getNome())){
                formati.add(c.getFormato().getNome());
            }
        }
        filmDTO.setFormati(formati);
        filmDTO.setLingue(lingue);


        model.addAttribute("film", filmDTO);
        return "filmDettaglio";
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
    
    @GetMapping("/salaAcquisto/{id}")
    public @ResponseBody PostiDTO[][] listaPosti(@PathVariable("id") Integer id){
    	return postiService.getPosti(id);
    }

}
