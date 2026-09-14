package it.made.cinema.Controller;

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
    public ResponseEntity<Map<String, Object>> modificaUtente(Authentication authentication, @RequestBody DatiUtenteDTO datiModifica) {

        DatabaseUserDetails userDetails = (DatabaseUserDetails) authentication.getPrincipal();
        Utente utente = repoUtenti.findById(userDetails.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Utente non trovato"));

        Map<String, String> erroriCampi = new LinkedHashMap<>();
        boolean modificato = false;

        if (datiModifica.getNome() != null) {
            if (!datiModifica.getNome().isBlank()) {
                utente.setNome(datiModifica.getNome());
                modificato = true;
            } else {
                erroriCampi.put("nome", "Il nome non può essere vuoto");
            }
        }

        if (datiModifica.getCognome() != null) {
            if (!datiModifica.getCognome().isBlank()) {
                utente.setCognome(datiModifica.getCognome());
                modificato = true;
            } else {
                erroriCampi.put("cognome", "Il cognome non può essere vuoto");
            }
        }

        if (datiModifica.getUsername() != null) {
            if (!datiModifica.getUsername().isBlank()) {
                utente.setUsername(datiModifica.getUsername());
                modificato = true;
            } else {
                erroriCampi.put("username", "Lo username non può essere vuoto");
            }
        }

        if (datiModifica.getEmail() != null) {
            if (!datiModifica.getEmail().isBlank()) {
                utente.setEmail(datiModifica.getEmail());
                modificato = true;
            } else {
                erroriCampi.put("email", "L'email non può essere vuota");
            }
        }

        if (datiModifica.getDataNascita() != null) {
            utente.setDataNascita(datiModifica.getDataNascita());
            modificato = true;
        }

        if (datiModifica.getPassword() != null) {
            if (!datiModifica.getPassword().isBlank()) {
                utente.setPassword("{noop}" + datiModifica.getPassword());
                modificato = true;
            } else {
                erroriCampi.put("password", "La password non può essere vuota");
            }
        }

        if (datiModifica.getNTelefono() != null) {
            if (!datiModifica.getNTelefono().isBlank()) {
                utente.setNTelefono(datiModifica.getNTelefono());
                modificato = true;
            } else {
                erroriCampi.put("telefono", "Il numero di telefono non può essere vuoto");
            }
        }

        if (datiModifica.getIndirizzo() != null) {
            if (!datiModifica.getIndirizzo().isBlank()) {
                utente.setIndirizzo(datiModifica.getIndirizzo());
                modificato = true;
            } else {
                erroriCampi.put("indirizzo", "L'indirizzo non può essere vuoto");
            }
        }

        if (datiModifica.getCitta() != null) {
            if (!datiModifica.getCitta().isBlank()) {
                utente.setCitta(datiModifica.getCitta());
                modificato = true;
            } else {
                erroriCampi.put("citta", "La città non può essere vuota");
            }
        }

        if (datiModifica.getCap() != null) {
            if (!datiModifica.getCap().isBlank()) {
                utente.setCap(datiModifica.getCap());
                modificato = true;
            } else {
                erroriCampi.put("cap", "Il CAP non può essere vuoto");
            }
        }

        Map<String, Object> risposta = new LinkedHashMap<>();

        if (!erroriCampi.isEmpty()) {
            risposta.put("success", false);
            risposta.put("messaggio", "Alcuni campi non sono validi");
            risposta.put("erroriCampi", erroriCampi);
            return ResponseEntity.badRequest().body(risposta);
        }

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