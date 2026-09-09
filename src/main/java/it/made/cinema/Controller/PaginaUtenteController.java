package it.made.cinema.Controller;

import it.made.cinema.Model.DTO.DatiUtenteDTO;
import it.made.cinema.Model.DTO.OfferteDTO;
import it.made.cinema.Model.DTO.PostiOccupatiDTO;
import it.made.cinema.Model.AcquistiGadget;
import it.made.cinema.Model.Offerta;
import it.made.cinema.Model.PostiOccupati;
import it.made.cinema.Model.Utente;
import it.made.cinema.Repository.IRepoAcquisti;
import it.made.cinema.Repository.IRepoOfferte;
import it.made.cinema.Repository.IRepoPostiOccupati;
import it.made.cinema.Repository.IRepoUtenti;
import it.made.cinema.Security.DatabaseUserDetails;
import it.made.cinema.Service.PrezzoService;

import org.springframework.beans.factory.annotation.Autowired;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@Controller
@RequestMapping("/utente")
public class PaginaUtenteController {

    @Autowired
    IRepoUtenti repoUtenti;
    @Autowired
    IRepoPostiOccupati repoPO;
    @Autowired
    PrezzoService prezzoService;
    @Autowired
    IRepoOfferte repoOfferte;
    @Autowired
    IRepoAcquisti repoAcquisti;

    @GetMapping
    public String paginaUtente() {
        return "utente-profilo";
    }


    @GetMapping("/acquisti")
    public @ResponseBody List<PostiOccupatiDTO> bigliettiAcquistati(Authentication authentication) {
        DatabaseUserDetails userDetails = (DatabaseUserDetails) authentication.getPrincipal();
    	List<PostiOccupati> postiOccupati = repoPO.findByUtenteId(userDetails.getId());
        List<PostiOccupatiDTO> biglietti = new ArrayList<>();
        for (PostiOccupati posto : postiOccupati) {
            String[] posizioni = posto.getPosizione().split("_");

            biglietti.add(new PostiOccupatiDTO(
                    posto.getId(),
                    posto.getProgrammazioneFilm().getFilm().getTitolo(),
                    posto.getProgrammazioneFilm().getOrario(),
                    posto.getProgrammazioneFilm().getOrario().plusMinutes(posto.getProgrammazioneFilm().getFilm().getDurata() + 30),
                    posto.getProgrammazioneFilm().getDataProgrammazione(),
                    posto.getProgrammazioneFilm().getSala().getId(),
                    posto.getTipoPosto(),
                    Integer.valueOf(posizioni[0]),
                    Integer.valueOf(posizioni[1]),
                    posto.getPrezzo()
            ));
        }
        return biglietti;
    }

    //4) Relativi gadget o offerte ottenute dall'acquisto di film o utilizzo di offerte.(da fare tabella per legare utente-gadget-dataDiAcquisto)
    @GetMapping("acquistiOfferte")
    public @ResponseBody List<OfferteDTO> offerteAcquistate(Authentication authentication, @RequestParam(required = false) String genere) {
    	DatabaseUserDetails userDetails = (DatabaseUserDetails) authentication.getPrincipal();
        List<AcquistiGadget> acquistiGadget = repoAcquisti.findByUtenteIdAndOffertaGenere(userDetails.getId(), genere);
        List<OfferteDTO> acquisti = new ArrayList<>();
        for (AcquistiGadget acquisto : acquistiGadget) {
            acquisti.add(new OfferteDTO(
                    acquisto.getId(),
                    acquisto.getOfferta().getNome(),
                    acquisto.getOfferta().getImgBanner(),
                    acquisto.getDataAcquisto()
            ));
        }
        return acquisti;
    }

    //2) Se ha acquistato una card(ricaricabile) e o abbonamento.
    @GetMapping("/abbonamento")
    public Boolean abbonamento(Authentication authentication) {
    	DatabaseUserDetails userDetails = (DatabaseUserDetails) authentication.getPrincipal();
        Optional<Utente> utenteOpt = repoUtenti.findById(userDetails.getId());
        if (utenteOpt.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Utente non trovato");
        }
        Utente utente = utenteOpt.get();
        Boolean statoAbbonamento = utente.getCartaRicaricabile();
        return statoAbbonamento;
    }

    //3) Cambiare i suoi dati tipo l'email.
    @PostMapping("/modifica")
    @ResponseBody
    public ResponseEntity<String> modificaUtente(
    		Authentication authentication,
            @RequestBody DatiUtenteDTO datiModifica) {
    	DatabaseUserDetails userDetails = (DatabaseUserDetails) authentication.getPrincipal();
        Utente utente = repoUtenti.findById(userDetails.getId()).get();

        // Modifica email se presente
        if (datiModifica.getEmail() != null && !datiModifica.getEmail().isBlank()) {
            utente.setEmail(datiModifica.getEmail());
        }

        // Modifica password se presente
        if (datiModifica.getPassword() != null && !datiModifica.getPassword().isBlank()) {
            utente.setPassword(datiModifica.getPassword()); // ← quando avrai Spring Security qui va l'encoder
        }

        repoUtenti.save(utente);
        return ResponseEntity.ok("Dati aggiornati con successo");
    }

    //5) Card myS&G (carta con punti ottenuti).
    @GetMapping("/punti")
    public Integer puntiMembership(Authentication authentication) {
    	DatabaseUserDetails userDetails = (DatabaseUserDetails) authentication.getPrincipal();
        Optional<Utente> utenteOpt = repoUtenti.findById(userDetails.getId());
        if (utenteOpt.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Utente non trovato");
        }
        Utente utente = utenteOpt.get();
        Integer nPunti = utente.getPuntiMembership();
        return nPunti;
    }

}
