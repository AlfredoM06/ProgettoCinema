package it.made.cinema.Controller;

import it.made.cinema.Model.DTO.CineFansDTO;
import it.made.cinema.Model.DTO.DatiUtenteDTO;
import it.made.cinema.Model.DTO.OfferteDTO;
import it.made.cinema.Model.DTO.PostiOccupatiDTO;
import it.made.cinema.Model.*;
import it.made.cinema.Repository.*;
import it.made.cinema.Security.DatabaseUserDetails;
import it.made.cinema.Service.PrezzoService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;

import java.util.*;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
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
    @Autowired
    IRepoCarrello repoCarrello;
    @Autowired
    PasswordEncoder passwordEncoder;

    @GetMapping
    public String paginaUtente(Authentication authentication, Model model) {
        DatabaseUserDetails userDetails = (DatabaseUserDetails) authentication.getPrincipal();
        Utente utente = repoUtenti.findById(userDetails.getId()).get();
        model.addAttribute("utente", utente);
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
    @GetMapping("/acquistiOfferte")
    public @ResponseBody List<OfferteDTO> offerteAcquistate(Authentication authentication) {
    	DatabaseUserDetails userDetails = (DatabaseUserDetails) authentication.getPrincipal();
        List<AcquistiGadget> acquistiGadget = repoAcquisti.findByUtenteId(userDetails.getId());
        List<OfferteDTO> acquisti = new ArrayList<>();
        for (AcquistiGadget acquisto : acquistiGadget) {
            acquisti.add(new OfferteDTO(
                    acquisto.getOfferta().getId(),
                    acquisto.getId(),
                    acquisto.getOfferta().getNome(),
                    acquisto.getOfferta().getImgBannerTopOfferte(),
                    acquisto.getDataAcquisto(),
                    acquisto.getOfferta().getPrezzo(),
                    acquisto.getQuantita()
            ));
        }
        return acquisti;
    }

    //2) Se ha acquistato una card(ricaricabile) e o abbonamento.
    @GetMapping("/abbonamento")
    public CineFansDTO abbonamento(Authentication authentication) {
    	DatabaseUserDetails userDetails = (DatabaseUserDetails) authentication.getPrincipal();
        Optional<Utente> utenteOpt = repoUtenti.findById(userDetails.getId());
        if (utenteOpt.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Utente non trovato");
        }
        Utente utente = utenteOpt.get();
        CineFansDTO statoCarta = new CineFansDTO(utente.getNomeCarta().getImgCarta(),utente.getNomeCarta().getNome(),utente.getUtilizziCard(),utente.getCartaRicaricabile());
        return statoCarta;
    }

    //3) Cambiare i suoi dati tipo l'email.
    @PostMapping("/modifica")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> modificaUtente(Authentication authentication, @RequestBody DatiUtenteDTO datiModifica) {

        DatabaseUserDetails userDetails = (DatabaseUserDetails) authentication.getPrincipal();
        Utente utente = repoUtenti.findById(userDetails.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Utente non trovato"));

        boolean modificato = false;

        if (datiModifica.getNome() != null) {
            utente.setNome(datiModifica.getNome());
            modificato = true;
        }
        if (datiModifica.getCognome() != null) {
            utente.setCognome(datiModifica.getCognome());
            modificato = true;
        }
        if (datiModifica.getUsername() != null) {
            utente.setUsername(datiModifica.getUsername());
            modificato = true;
        }
        if (datiModifica.getEmail() != null) {
            utente.setEmail(datiModifica.getEmail());
            modificato = true;
        }
        if (datiModifica.getDataNascita() != null) {
            utente.setDataNascita(datiModifica.getDataNascita());
            modificato = true;
        }
        if (datiModifica.getPassword() != null) {
            utente.setPassword("{noop}" + datiModifica.getPassword());
            modificato = true;
        }
        if (datiModifica.getCellulare() != null) {
            utente.setCellulare(datiModifica.getCellulare());
            modificato = true;
        }
        if (datiModifica.getIndirizzo() != null) {
            utente.setIndirizzo(datiModifica.getIndirizzo());
            modificato = true;
        }
        if (datiModifica.getCitta() != null) {
            utente.setCitta(datiModifica.getCitta());
            modificato = true;
        }
        if (datiModifica.getCap() != null) {
            utente.setCap(datiModifica.getCap());
            modificato = true;
        }

        Map<String, Object> risposta = new LinkedHashMap<>();

        if (!modificato) {
            risposta.put("success", false);
            risposta.put("messaggio", "Nessun dato da modificare");
            return ResponseEntity.badRequest().body(risposta);
        }

        repoUtenti.save(utente);

        risposta.put("success", true);
        risposta.put("messaggio", "Dati aggiornati con successo");
        return ResponseEntity.ok(risposta);
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

    @PostMapping("/eliminaUtente")
    @ResponseBody
    @Transactional
    public Boolean eliminaAccount(@RequestBody Map<String, String> body, Authentication authentication, HttpServletRequest request) {
    	String password = body.get("password");
    	if(password == null || password.isBlank()) {
    		return false;
    	}
    	DatabaseUserDetails userDetails = (DatabaseUserDetails) authentication.getPrincipal();
        Optional<Utente> utenteOpt = repoUtenti.findById(userDetails.getId());
        if (utenteOpt.isEmpty()) {
            return false;
        }		
        Utente utente = utenteOpt.get();
        boolean passwordCorretta = passwordEncoder.matches(password, utente.getPassword());
        if (!passwordCorretta) {
            return false;
        }
        Carrello carrello = utente.getCarrello();
        repoPO.deleteByUtenteId(utente.getId());
        repoAcquisti.deleteByUtenteId(utente.getId());
        if(carrello != null) {
        repoCarrello.deleteByUtenteId(utente.getId());
        }
        repoUtenti.delete(utente);
        new SecurityContextLogoutHandler().logout(request, null, authentication);
    	return true;
	}
}