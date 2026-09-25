package it.made.cinema.Controller;

import java.sql.Date;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

import it.made.cinema.Model.*;
import it.made.cinema.Repository.*;
import it.made.cinema.Security.DatabaseUserDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.server.ResponseStatusException;

@Controller
@RequestMapping("/prossimamente")
public class ProssimamenteController {

    //c'è la pagina
    //lista film, dettagli film, log in per la prenotazione,
    @Autowired
    private IRepoFilm repoFilm;
    @Autowired
    private IRepoUtenti repoUtenti;
    @Autowired
    private IRepoProgrammazione repoProgrammazione;
    @Autowired
    private IRepoSala repoSala;
    @Autowired
    private IRepoPosto repoPosto;

    @GetMapping
    public String listaProssimamente(Model model) {
        //aggiungere if per controllare se è archiviato o meno, vedere se modificare la query
        List<Film> risultatoRicerca = repoFilm.findByAllDate();
        model.addAttribute("filmProssimamente", risultatoRicerca);
        return "prossimamente";
    }

    @GetMapping("/prenota/{idFilm}")
    public String prenota(@PathVariable Integer idFilm, Authentication authentication, Model model) {
        DatabaseUserDetails userDetails = (DatabaseUserDetails) authentication.getPrincipal();
        ProgrammazioneFilm programmazione = repoProgrammazione.findByFilmIdAndAnteprimaTrue(idFilm);
        Film film = repoFilm.findById(programmazione.getFilm().getId()).get();
        Sala sala = repoSala.findById(programmazione.getSala().getId()).get();

        List<Posto> posti = repoPosto.findAll();

        model.addAttribute("posti", posti);
        model.addAttribute("titolo", film.getTitolo());
        model.addAttribute("poster", film.getImg_poster());
        model.addAttribute("sala", sala.getId());
        model.addAttribute("formato", sala.getFormato());
        model.addAttribute("data", programmazione.getDataProgrammazione());
        model.addAttribute("inizio", programmazione.getOrario());
        model.addAttribute("fine", programmazione.getOrario().plusMinutes(film.getDurata() + 30));
        model.addAttribute("idFilm", programmazione.getFilm().getId());
        model.addAttribute("idUtente", userDetails.getId());
        model.addAttribute("prezzo", film.getPrezzo());

        return "prenotazioneBiglietto";
    }


    // metodo che restituisce un boolean e che controlla data e membership per accedere alla programmazione
    @GetMapping("/anteprima/{idFilm}")
    @ResponseBody
    public Boolean anteprima(@PathVariable Integer idFilm, Authentication authentication) {

        DatabaseUserDetails userDetails = (DatabaseUserDetails) authentication.getPrincipal();
        Utente utente = repoUtenti.findById(userDetails.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Utente non trovato"));

        ProgrammazioneFilm programmazione = repoProgrammazione.findByFilmIdAndAnteprimaTrue(idFilm);
        if (programmazione == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Anteprima non trovata");
        }

        if (Boolean.TRUE.equals(utente.getMembership())) {
            return true;
        }

        LocalDateTime inizioAnteprima = LocalDateTime.of(
                programmazione.getDataProgrammazione(),
                programmazione.getOrario()
        );
        LocalDateTime sogliaAccesso = inizioAnteprima.minusHours(5);

        return LocalDateTime.now().isAfter(sogliaAccesso);
    }

}
