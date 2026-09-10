package it.made.cinema.Controller;

import it.made.cinema.Model.DTO.DatiUtenteDTO;
import it.made.cinema.Model.DTO.OfferteDTO;
import it.made.cinema.Model.DTO.PostiOccupatiDTO;
import it.made.cinema.Model.*;
import it.made.cinema.Model.DTO.ProfiloDTO;
import it.made.cinema.Repository.*;
import it.made.cinema.Security.DatabaseUserDetails;
import it.made.cinema.Service.PrezzoService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

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

    @GetMapping
    public String paginaUtente(Authentication authentication, Model model) {
        DatabaseUserDetails userDetails = (DatabaseUserDetails) authentication.getPrincipal();
        Utente utente = repoUtenti.findById(userDetails.getId()).get();
        model.addAttribute("utente", utente);
        return "utente-profilo";
    }

   /* @GetMapping("/profilo")
    @ResponseBody
    public ProfiloDTO profilo (Authentication authentication){
        DatabaseUserDetails userDetails = (DatabaseUserDetails) authentication.getPrincipal();
        Utente utente = repoUtenti.findById(userDetails.getId()).get();

        ProfiloDTO profiloDTO = new ProfiloDTO();
        profiloDTO.setId(utente.getId());
        profiloDTO.setNome(utente.getNome());
        profiloDTO.setCognome(utente.getCognome());
        profiloDTO.setEmail(utente.getEmail());
        profiloDTO.setNTelefono(utente.getNTelefono());
        profiloDTO.setIndirizzo(utente.getIndirizzo());
        profiloDTO.setCitta(utente.getCitta());
        profiloDTO.setCap(utente.getCap());
        profiloDTO.setDataNascita(utente.getDataNascita());
        profiloDTO.setMembership(utente.getMembership());
        profiloDTO.setPuntiMembership(utente.getPuntiMembership());

        return profiloDTO;
    }*/

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
                    acquisto.getOfferta().getPrezzo()
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
        if (!password.equals(utente.getPassword())) {
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