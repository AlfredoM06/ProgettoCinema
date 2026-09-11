package it.made.cinema.Controller;

import it.made.cinema.Model.AcquistiGadget;
import it.made.cinema.Model.Carrello;
import it.made.cinema.Model.NomeCarta;
import it.made.cinema.Model.Offerta;
import it.made.cinema.Model.Utente;
import it.made.cinema.Model.DTO.CarrelloDTO;
import it.made.cinema.Model.DTO.ListaOffertaDTO;
import it.made.cinema.Repository.IRepoAcquisti;
import it.made.cinema.Repository.IRepoCarrello;
import it.made.cinema.Repository.IRepoCarta;
import it.made.cinema.Repository.IRepoOfferte;
import it.made.cinema.Repository.IRepoUtenti;
import it.made.cinema.Security.DatabaseUserDetails;
import it.made.cinema.Service.PrezzoService;
import it.made.cinema.Service.PuntiService;
import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Controller
@RequestMapping("/carrello")
public class CarrelloController {

    @Autowired
    IRepoUtenti repoUtenti;

    @Autowired
    IRepoCarrello repoCarrello;

    @Autowired
    IRepoOfferte repoOfferte;

    @Autowired
    IRepoCarta repoCarta;

    @Autowired
    IRepoAcquisti repoAcquisti;
    
    @Autowired
    PrezzoService prezzoService;
    
    @Autowired PuntiService puntiService;

    //Se l'utente non ha il carello adesso con questo metodo c'è l'ha
    public Carrello creaCarrello(Utente utente) {
        Carrello carrello = new Carrello();
        carrello.setUtente(utente);
        repoCarrello.save(carrello);
        utente.setCarrello(carrello);
        repoUtenti.save(utente);
        return carrello;
    }

    //mostrare carello
    @GetMapping
    String carrello(Model model, Authentication authentication) {
        DatabaseUserDetails userDetails = (DatabaseUserDetails) authentication.getPrincipal();
        Utente utente = repoUtenti.findById(userDetails.getId()).get();
        Carrello carrello = repoCarrello.findByUtenteId(utente.getId());
        CarrelloDTO carello = new CarrelloDTO();
        if (carrello == null) {
            carrello = creaCarrello(utente);
        }
        if (carrello.getListaOfferte() == null) {
            carrello.setListaOfferte(new ArrayList<>());
        }
        List<ListaOffertaDTO> offerteDTO = new ArrayList<ListaOffertaDTO>();
        Double prezzoTotale = 0d;
        for (Offerta offerta : carrello.getListaOfferte()) {
            Double prezzoScontato = prezzoService.calcolaScontoOfferta(utente,offerta);
        	prezzoTotale += prezzoScontato;
        	Double valoreSconto = offerta.getPrezzo() - prezzoScontato;
            offerteDTO.add(new ListaOffertaDTO(offerta.getId(), offerta.getNome(), offerta.getGenere(), offerta.getDescrizione(), offerta.getImgBannerTopOfferte(), offerta.getPrezzo(), prezzoScontato, offerta.getDataInizio(), valoreSconto));
        }
        if(carrello.getCarta()!= null) {
        	prezzoTotale += carrello.getCarta().getPrezzo();
        	carello.setNomeCarta(carrello.getCarta().getNome());
            carello.setImgCarta(carrello.getCarta().getImgCarta());
            carello.setPrezzoCarta(carrello.getCarta().getPrezzo());
        }
        Integer punti = puntiService.puntiAcquisto(prezzoTotale);
        carello.setPrezzoFinale(prezzoTotale);
        carello.setPunti(punti);
        carello.setListaOfferta(offerteDTO);
        carello.setId(carrello.getId());
        model.addAttribute("carrello", carello);
        return "carrello";
    }

    //metodo per aggiungere al carello
    @PostMapping("/aggiungi/{idOfferta}")
    @ResponseBody
    public Boolean aggiungi(Authentication authentication, @PathVariable Integer idOfferta) {
        DatabaseUserDetails userDetails = (DatabaseUserDetails) authentication.getPrincipal();
        Utente utente = repoUtenti.findById(userDetails.getId()).get();
        Carrello carello = repoCarrello.findByUtenteId(utente.getId());
        if (carello == null) {
            carello = creaCarrello(utente);
        }
        Offerta offerta = repoOfferte.findById(idOfferta).get();
        carello.getListaOfferte().add(offerta);
        repoCarrello.save(carello);
        return true;
    }

    //metodo per togliere
    @PostMapping("/elimina/{idCarrello}/{idOfferta}")
    @ResponseBody
    public Boolean elimina(@PathVariable Integer idCarrello, @PathVariable Integer idOfferta) {
        Carrello carrello = repoCarrello.findById(idCarrello).get();
        Offerta offerta = repoOfferte.findById(idOfferta).get();

        for (Offerta o : carrello.getListaOfferte()) {
            if (o.equals(offerta)) {
                carrello.getListaOfferte().remove(o);
                break;
            }
        }
        repoCarrello.save(carrello);

        return true;
    }

    //elimina singolo item
    @PostMapping("/rimuoviUno/{idOfferta}")
    @Transactional
    @ResponseBody
    public CarrelloDTO rimuoviUno(Authentication authentication, @PathVariable Integer idOfferta) {
        DatabaseUserDetails userDetails = (DatabaseUserDetails) authentication.getPrincipal();
        Utente utente = repoUtenti.findById(userDetails.getId()).get();
        Carrello carrello = repoCarrello.findByUtenteId(utente.getId());

        if (utente == null) {
            return null;
        }

        if (carrello == null) {
            return null;
        }

        if (carrello.getListaOfferte() == null) {
            carrello.setListaOfferte(new ArrayList<>());
        }

        // Rimuove UNA sola copia dell'offerta
        for (Offerta offerta : carrello.getListaOfferte()) {
            if (offerta.getId().equals(idOfferta)) {
                carrello.getListaOfferte().remove(offerta);
                break;
            }
        }

        repoCarrello.save(carrello);
        // Creo il DTO da restituire al frontend
        CarrelloDTO carrelloDTO = new CarrelloDTO();
        carrelloDTO.setId(carrello.getId());
        double prezzoFinale = 0d;

        for (Offerta offerta : carrello.getListaOfferte()) {
            double prezzoScontato = prezzoService.calcolaScontoOfferta(utente, offerta);
            prezzoFinale += prezzoScontato;
        }

        // La carta viene conteggiata una sola volta
        if (carrello.getCarta() != null) {
            prezzoFinale += carrello.getCarta().getPrezzo();
            carrelloDTO.setNomeCarta(carrello.getCarta().getNome());
            carrelloDTO.setImgCarta(carrello.getCarta().getImgCarta());
            carrelloDTO.setPrezzoCarta(carrello.getCarta().getPrezzo());
        }

        Integer punti = puntiService.puntiAcquisto(prezzoFinale);
        carrelloDTO.setPrezzoFinale(prezzoFinale);
        carrelloDTO.setPunti(punti);
        return carrelloDTO;
    }

    //metodo per acquistare e salvare sul db l'offerta che l'utente ha acquistato
    @PostMapping("/acquistaOfferta/{idOfferta}")
    @Transactional
    public String acquistaOfferta(Authentication authentication, @PathVariable Integer idOfferta) {
        DatabaseUserDetails userDetails = (DatabaseUserDetails) authentication.getPrincipal();
        Utente utente = repoUtenti.findById(userDetails.getId()).get();
        Offerta offerta = repoOfferte.findById(idOfferta).get();
        Carrello carello = repoCarrello.findByUtenteId(utente.getId());
        if(carello==null) {
        	carello = creaCarrello(utente);
        }
        if (carello.getListaOfferte() == null) {
            carello.setListaOfferte(new ArrayList<>());
        }
        carello.getListaOfferte().add(offerta);
        repoCarrello.save(carello);
        return "redirect:/carrello" ;
    }

    @PostMapping("/acquistaCarta/{idCarta}")
    @Transactional
    public ResponseEntity<?> acquistaCarta(Authentication authentication, @PathVariable Integer idCarta) {

        DatabaseUserDetails userDetails = (DatabaseUserDetails) authentication.getPrincipal();
        Utente utente = repoUtenti.findById(userDetails.getId()).get();

        // Utente ha già una carta ricaricabile attiva
        if (Boolean.TRUE.equals(utente.getCartaRicaricabile())) {
            return ResponseEntity.badRequest().body(-1d);
        }

        Carrello carrello = repoCarrello.findByUtenteId(utente.getId());
        if (carrello == null) {
            carrello = creaCarrello(utente);
        }

        // ← AGGIUNTO — c'è già una carta nel carrello
        if (carrello.getCarta() != null) {
            return ResponseEntity.badRequest().body(-2d);
        }

        NomeCarta carta = repoCarta.findById(idCarta).get();
        carrello.setCarta(carta);
        repoCarrello.save(carrello);

        return ResponseEntity.ok().build();
    }

    @Transactional
    @PostMapping("/confermaAcquisti")
    @ResponseBody
    public Boolean confermaAcquisto(Authentication authentication) {
        DatabaseUserDetails userDetails = (DatabaseUserDetails) authentication.getPrincipal();
        Utente utente = repoUtenti.findById(userDetails.getId()).orElse(null);
        if (utente == null) {
            return false;
        }

        Carrello carrello = repoCarrello.findByUtenteId(utente.getId());
        if (carrello == null) {
            return false;
        }

        // Calcolo il prezzo finale del carrello (stessa logica usata per l'anteprima punti)
        double prezzoFinale = 0d;
        if (carrello.getListaOfferte() != null) {
            for (Offerta offerta : carrello.getListaOfferte()) {
                prezzoFinale += prezzoService.calcolaScontoOfferta(utente, offerta);
            }
        }
        if (carrello.getCarta() != null) {
            prezzoFinale += carrello.getCarta().getPrezzo();
        }

        // Acquisto/attivazione carta ricaricabile
        if (carrello.getCarta() != null && !Boolean.TRUE.equals(utente.getCartaRicaricabile())) {
            utente.setNomeCarta(carrello.getCarta());
            utente.setCartaRicaricabile(true);
            utente.setDataAcquisto(LocalDate.now());
            utente.setDataScadenza(LocalDate.now().plusYears(1));
            utente.setUtilizziCard(carrello.getCarta().getUtilizziCard());
        }

        // Salvataggio acquisti offerte
        if (carrello.getListaOfferte() != null) {
            for (Offerta offerta : carrello.getListaOfferte()) {
                AcquistiGadget acquisto = new AcquistiGadget();
                acquisto.setUtente(utente);
                acquisto.setOfferta(offerta);
                acquisto.setDataAcquisto(LocalDate.now());
                repoAcquisti.save(acquisto);
            }
        }

        // Accredito punti membership SOLO se l'utente ha la carta punti myS&G
        if (Boolean.TRUE.equals(utente.getMembership()) && prezzoFinale > 0) {
            Integer puntiGuadagnati = puntiService.puntiAcquisto(prezzoFinale);
            Integer puntiAttuali = utente.getPuntiMembership() != null ? utente.getPuntiMembership() : 0;
            utente.setPuntiMembership(puntiAttuali + puntiGuadagnati);
        }

        repoUtenti.save(utente);
        carrello.setCarta(null);
        carrello.getListaOfferte().clear();
        repoCarrello.save(carrello);
        return true;
    }

    @PostMapping("/eliminaCarta/")
    @Transactional
    @ResponseBody
    public Boolean eliminaCarta(Authentication authentication) {
    	DatabaseUserDetails userDetails = (DatabaseUserDetails) authentication.getPrincipal();
    	Utente utente = repoUtenti.findById(userDetails.getId()).orElse(null);
    	if (utente == null) {
    		return false;
    	}
    	Carrello carrello = repoCarrello.findByUtenteId(utente.getId());
    	if (carrello.getCarta() == null) {
    	    return false;
    	}
    	carrello.setCarta(null);
    	repoCarrello.save(carrello);
		return true;
		
    }
}