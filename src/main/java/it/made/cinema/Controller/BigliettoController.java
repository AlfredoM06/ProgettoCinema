package it.made.cinema.Controller;

import it.made.cinema.Model.*;
import it.made.cinema.Model.DTO.AcquistoDTO;
import it.made.cinema.Model.DTO.BigliettoAcquistatoDTO;
import it.made.cinema.Model.DTO.PostiDTO;
import it.made.cinema.Model.DTO.ScontrinoDTO;
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
    @Autowired
    IRepoPostiOccupati postiOccupati;
    /*
    // tipi.add((int) c);  char è una specializzazione di int quindi puoi up-castarlo nel suo tipo generico ovvero int
    @GetMapping("/prezzoBiglietto/{idFilm}/{idUtente}/{tipi}")
    @ResponseBody
    public Double prezzoBiglietto(@PathVariable Integer idFilm, @PathVariable Integer idUtente, @PathVariable Integer tipi) {

        Film film = repoFilm.findById(idFilm).get(); //film scelto
        Utente utente = repoUtenti.findById(idUtente).get(); //utente loggato

        return prezzoService.calcolaPrezzoFinale(utente, film, tipi, false);
     }
    */
    //11) Per determinate cose si hanno dei punti extra (es. chi vede i film sponsorizzati riceveranno punti extra)
    @PostMapping("/acquistoBiglietto")
    public @ResponseBody ScontrinoDTO acquistoBiglietto(@RequestBody AcquistoDTO acquistoBiglietto) {
        Film film = repoFilm.findById(acquistoBiglietto.getId_film()).get();
        Utente utente = repoUtenti.findById(acquistoBiglietto.getId_utente()).get();
        ProgrammazioneFilm programmazioneFilm = repoProgrammazione.findById(acquistoBiglietto.getId_programmazione()).get();
        Integer puntiCarta = utente.getPuntiMembership();
        Double prezzoTotale = 0d;
        ScontrinoDTO scontrino = new ScontrinoDTO();
        for (PostiDTO posto: acquistoBiglietto.getListaPostiDTO()){
            Double prezzoFinale = prezzoService.calcolaPrezzoFinale(utente, film, posto.getTipo(), puntiCarta);
            prezzoTotale += prezzoFinale;
            if (acquistoBiglietto.getAcquisto()){
                // creare il posto occupato / biglietto
                PostiOccupati biglietto = new PostiOccupati();
                biglietto.setOccupato(true);
                biglietto.setPosizione(posto.getId());
                biglietto.setUtente(utente);
                biglietto.setProgrammazioneFilm(programmazioneFilm);
                biglietto.setTipoPosto(posto.getTipo());
                biglietto.setPrezzo(prezzoFinale);
                postiOccupati.save(biglietto);
            }

            BigliettoAcquistatoDTO bigliettoAcquistato = new BigliettoAcquistatoDTO();
            bigliettoAcquistato.setPrezzoBiglietto(prezzoFinale);
            bigliettoAcquistato.setPosizione(posto.getId());
            bigliettoAcquistato.setTipo(posto.getTipo());

            scontrino.getBigliettiAcquistati().add(bigliettoAcquistato);
        }

        scontrino.setPrezzoTotale(prezzoTotale);

        Boolean partnership = null;
        //controllo se il film è sponsorizzato
        if (!film.getPartnership().getId().equals(0)) {
            partnership = Boolean.TRUE;
        }

        Integer punti = puntiService.puntiBiglietto(prezzoTotale, partnership);
        scontrino.setPuntiGuadagnati(punti);

        if (acquistoBiglietto.getAcquisto()){
            // aggiornare repo utente con i punti nuovi facendo get punti + punti
            utente.setPuntiMembership(puntiCarta+punti);
            repoUtenti.save(utente);
        }

        return scontrino;
    }
}