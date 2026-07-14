package it.made.cinema.Controller;

import it.made.cinema.Model.Film;
import it.made.cinema.Model.Posto;
import it.made.cinema.Model.Utente;
import it.made.cinema.Repository.IRepoFilm;
import it.made.cinema.Repository.IRepoOfferte;
import it.made.cinema.Repository.IRepoPosto;
import it.made.cinema.Repository.IRepoUtenti;
import it.made.cinema.Service.PrezzoService;
import it.made.cinema.Service.PuntiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/biglietto")
public class BigliettoController {
    @Autowired
    IRepoUtenti repoUtenti;
    @Autowired
    IRepoFilm repoFilm;
    @Autowired
    IRepoPosto repoPosto;
    @Autowired
    PrezzoService prezzoService;
    @Autowired
    PuntiService puntiService;

    //9) Film e o menu gratis/scontati a seconda dei punti.(controller membership)
    @GetMapping("/biglietto/{idFilm}/{idUtente}/{idPosto}")
    public String acquisto(@PathVariable Integer idFilm, @PathVariable Integer idUtente, @PathVariable Integer idPosto, Model model) {

        Film film = repoFilm.findById(idFilm).get();
        Utente utente = repoUtenti.findById(idUtente).get();
        Posto posto = repoPosto.findById(idPosto).get();
        
        Double prezzoFinale = prezzoService.calcolaPrezzoFinale(utente, film, posto);

        model.addAttribute("prezzoFinale", prezzoFinale);
        model.addAttribute("film", film);
        model.addAttribute("posto", posto);

        return "";
    }

    //11) Per determinate cose si hanno dei punti extra (es. chi vede i film sponsorizzati riceveranno punti extra)
    @GetMapping("/puntiBiglietto/{idFilm}/{idUtente}/{idPosto}")
    public @ResponseBody Integer puntiBiglietto(@PathVariable Integer idFilm, @PathVariable Integer idUtente, @PathVariable Integer idPosto, Model model){
        Film film = repoFilm.findById(idFilm).get();
        Utente utente = repoUtenti.findById(idUtente).get();
        Posto posto = repoPosto.findById(idPosto).get();
        Double prezzoFinale = prezzoService.calcolaPrezzoFinale(utente, film, posto);
        Boolean partnership = null;
        
        if (film.getPartnership().equals(true)) {
            partnership = Boolean.TRUE;
        }
        Integer puntiTot= puntiService.puntiBiglietto(prezzoFinale, partnership);
        return puntiTot;
    }
    



}
