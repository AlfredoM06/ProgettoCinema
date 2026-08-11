package it.made.cinema.Controller;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

import it.made.cinema.Model.*;
import it.made.cinema.Model.DTO.*;
import it.made.cinema.Repository.IRepoSala;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import Scheduler.LocalDateComparator;
import it.made.cinema.Repository.IRepoFilm;
import it.made.cinema.Repository.IRepoGeneri;
import it.made.cinema.Repository.IRepoProgrammazione;
import it.made.cinema.Service.PostiService;
import it.made.cinema.Service.PrezzoService;

@Controller
@RequestMapping("/inSala")
public class InSalaController {
    // nozione = new LinkedList<>(); //è la stessa cosa di una lista ma mantiene l'ordine degli oggetti
    @Autowired
    private IRepoFilm repoFilm;
    @Autowired
    private IRepoGeneri repoGeneri;
    @Autowired
    PrezzoService prezzoService;
    @Autowired
    PostiService postiService;
    @Autowired
    IRepoProgrammazione repoProgrammazione;
    @Autowired
    IRepoSala repoSala;

    //index
    @GetMapping
    public String index() {
        return "inSala";
    }

    @GetMapping("/listaFilm")
    @ResponseBody
    public List<SelectFilmDTO> listaFilm(){
        List<SelectFilmDTO> listaFilm = new ArrayList<>();
        List<Film> films = repoFilm.findAll();
        for (Film f : films){
            listaFilm.add(new SelectFilmDTO(f.getId(), f.getTitolo(),f.getDurata()));
        }
        return listaFilm;
    }

    @GetMapping("/listaSale")
    @ResponseBody
    public Map<Integer, String> listaSale(){
        Map<Integer, String> listaSale = new HashMap<>();
        List<Sala> sale = repoSala.findAll();
        for (Sala s : sale){
            listaSale.put(s.getId(), "sala" + s.getId().toString());

        }

        return listaSale;
    }

    //dettagli di un film
    @GetMapping("/dettagli/{id}")
    private String dettagli(@PathVariable("id") Integer id, Model model) {
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
        Map<LocalDate, List<ListaProgDTO>> listaProgrammazioni = new HashMap<>();
        List<LocalDate> dates = new ArrayList<>();
        LocalDate oggi = LocalDate.now();
        for (int i = 0; i < 7; i++) {
            dates.add(oggi.plusDays(i)); //For per valorizzare i giorni per non fare più volte il for
        }
        // programmazioniS = separate programmazioniT = tutte a partire da oggi
        for (LocalDate d : dates ){
            List<ListaProgDTO> programmazioniS = new ArrayList<>();
            List<ProgrammazioneFilm> programmazioni = repoProgrammazione.findByDataProgrammazioneAndFilmId(d, film.getId());
            for (ProgrammazioneFilm p : programmazioni){
                ListaProgDTO programmazione = new ListaProgDTO();
                programmazione.setId(p.getId());
                programmazione.setPrezzo(film.getPrezzo());
                programmazione.setFormato(p.getSala().getFormato());
                programmazione.setId_film(film.getId());
                programmazione.setId_sala(p.getSala().getId());
                programmazione.setOrarioInizio(p.getOrario());
                programmazione.setOrarioFine(p.getOrario().plusMinutes(p.getFilm().getDurata() + 30));
                programmazioniS.add(programmazione);
            }
            listaProgrammazioni.put(d, programmazioniS);
        }
        filmDTO.setProgrammazioni(listaProgrammazioni);
        //List<ListaProgDTO> programmazioniT = new ArrayList<>();
        Map<LocalDate, List<ListaProgDTO>> mapTutti = new TreeMap<>(new LocalDateComparator());
        List<ProgrammazioneFilm> programmazioni = repoProgrammazione.findByDataProgrammazioneGreaterThanEqualAndFilmId(LocalDate.now(), film.getId());
        for (ProgrammazioneFilm p : programmazioni){
            ListaProgDTO programmazione = new ListaProgDTO();
            programmazione.setId(p.getId());
            programmazione.setPrezzo(film.getPrezzo());
            programmazione.setFormato(p.getSala().getFormato());
            programmazione.setId_film(film.getId());
            programmazione.setId_sala(p.getSala().getId());
            programmazione.setOrarioInizio(p.getOrario());
            programmazione.setOrarioFine(p.getOrario().plusMinutes(p.getFilm().getDurata() + 30));
            if(mapTutti.containsKey(p.getDataProgrammazione())) {
            	mapTutti.get(p.getDataProgrammazione()).add(programmazione);
            }
            else {
            	List<ListaProgDTO> programmazioniT = new ArrayList<>();
            	programmazioniT.add(programmazione);
            	mapTutti.put(p.getDataProgrammazione(), programmazioniT);
            }
        }
        filmDTO.setTutte(mapTutti);

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
            films = repoFilm.findByArchiviatoFalse();
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
