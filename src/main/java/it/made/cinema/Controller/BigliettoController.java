package it.made.cinema.Controller;

import it.made.cinema.Model.*;
import it.made.cinema.Model.DTO.AcquistoDTO;
import it.made.cinema.Repository.*;
import it.made.cinema.Service.PrezzoService;
import it.made.cinema.Service.PuntiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@Controller
@RequestMapping("/biglietto")
public class BigliettoController {

    @Autowired
    IRepoUtenti repoUtenti;
    @Autowired
    IRepoFilm repoFilm;
    @Autowired
    IRepoProgrammazione repoProgrammazione;
    @Autowired
    PrezzoService prezzoService;
    @Autowired
    PuntiService puntiService;

    // tipi.add((int) c);  char è una specializzazione di int quindi puoi up-castarlo nel suo tipo generico ovvero int
    @GetMapping("/prezzoBiglietto/{idFilm}/{idUtente}/{tipi}")
    @ResponseBody
    public Double prezzoBiglietto(@PathVariable Integer idFilm, @PathVariable Integer idUtente, @PathVariable Integer tipi) {

        Film film = repoFilm.findById(idFilm).get(); //film scelto
        Utente utente = repoUtenti.findById(idUtente).get(); //utente loggato

        return prezzoService.calcolaPrezzoFinale(utente, film, tipi, false);
     }

    //11) Per determinate cose si hanno dei punti extra (es. chi vede i film sponsorizzati riceveranno punti extra)
    @PostMapping("/acquistoBiglietto")
    public @ResponseBody Integer acquistoBiglietto(@RequestBody AcquistoDTO acquistoBiglietto) {
        Film film = repoFilm.findById(acquistoBiglietto.getId_film()).get();
        Utente utente = repoUtenti.findById(acquistoBiglietto.getId_utente()).get();
        ProgrammazioneFilm programmazioneFilm = repoProgrammazione.findById(acquistoBiglietto.getId_programmazione()).get();
        Double prezzoFinale = prezzoService.calcolaPrezzoFinale(utente, film, acquistoBiglietto.getPostiDTO().getTipo(), true);
        Boolean partnership = null;

        //controllo se il film è sponsorizzato
        if (film.getPartnership().equals(true)) {
            partnership = Boolean.TRUE;
        }
        Integer punti = puntiService.puntiBiglietto(prezzoFinale, partnership);

        // aggiornare repo utente con i punti nuovi facendo get punti + punti
        utente.setPuntiMembership(utente.getPuntiMembership()+punti);
        repoUtenti.save(utente);

        // creare il posto occupato / biglietto
        PostiOccupati biglietto = new PostiOccupati();
        biglietto.setOccupato(true);
        biglietto.setPosizione(acquistoBiglietto.getPostiDTO().getId());
        biglietto.setUtente(utente);
        biglietto.setProgrammazioneFilm(programmazioneFilm);
        biglietto.setTipoPosto(acquistoBiglietto.getPostiDTO().getTipo());

        // return dto dell'acquisto
        // va aggiunto in posti occupati un attributo prezzo che setto qui e lo salvo in modo che nel metodo di dom del biglietto non serve il calcolo ma si richiama il prezzo settato qua

        return null;
    }
}