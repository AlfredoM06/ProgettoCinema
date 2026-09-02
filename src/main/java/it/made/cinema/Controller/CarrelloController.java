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
        System.out.println("Carrello trovato: " + carrello);

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
        	prezzoTotale += offerta.getPrezzo();
            offerteDTO.add(new ListaOffertaDTO(offerta.getId(), offerta.getNome(), offerta.getGenere(), offerta.getDescrizione(), offerta.getImgBanner(), offerta.getPrezzo(), offerta.getDataInizio()));
        }
        if(carrello.getCarta()!= null) {
        	prezzoTotale += carrello.getCarta().getPrezzo();
        	carello.setNomeCarta(carrello.getCarta().getNome());
            carello.setPrezzoCarta(carrello.getCarta().getPrezzo());
        }
        Integer punti = puntiService.puntiAcquisto(prezzoTotale);
        carello.setPrezzoFinale(prezzoTotale);
        carello.setPunti(punti);
        carello.setListaOfferta(offerteDTO);
        carello.setId(carrello.getId());
        model.addAttribute("carrello", carello);
        System.out.println("Lista offerte: " + carrello.getListaOfferte());
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
    @PostMapping("/elimina/{idCarello}/{idOfferta}")
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

    //metodo per acquistare e salvare sul db l'offerta che l'utente ha acquistato
    @PostMapping("/acquistaOfferta/{idOfferta}")
    @ResponseBody
    @Transactional
    public Double acquistaOfferta(Authentication authentication, @PathVariable Integer idOfferta) {
        DatabaseUserDetails userDetails = (DatabaseUserDetails) authentication.getPrincipal();
        Utente utente = repoUtenti.findById(userDetails.getId()).get();
        Offerta offerta = repoOfferte.findById(idOfferta).get();
        Double prezzo = 0d;
        prezzo = prezzoService.calcolaScontoOfferta(utente, offerta);
        Carrello carello = repoCarrello.findByUtenteId(utente.getId());
        if(carello==null) {
        	carello = creaCarrello(utente);
        }
        if (carello.getListaOfferte() == null) {
            carello.setListaOfferte(new ArrayList<>());
        }
        carello.getListaOfferte().add(offerta);
        repoCarrello.save(carello);
        return prezzo;
    }

    @PostMapping("/acquistaCarta/{idCarta}")
    @ResponseBody
    @Transactional
    public Double acquistaCarta(Authentication authentication, @PathVariable Integer idCarta) {
        DatabaseUserDetails userDetails = (DatabaseUserDetails) authentication.getPrincipal();
        Utente utente = repoUtenti.findById(userDetails.getId()).get();
        if (utente.getCartaRicaricabile()) {
            return -1d;
        }
        NomeCarta carta = repoCarta.findById(idCarta).get();
        Double prezzo = carta.getPrezzo();
        Carrello carello = repoCarrello.findByUtenteId(utente.getId());
        if (carello == null) {
            carello = creaCarrello(utente);
        }
        carello.setCarta(carta);
        repoCarrello.save(carello);
        return prezzo;
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
    	if(carrello.getCarta() != null && !Boolean.TRUE.equals(utente.getCartaRicaricabile())) {
    		utente.setNomeCarta(carrello.getCarta());
    		utente.setCartaRicaricabile(true);
    		utente.setDataAcquisto(LocalDate.now());
    		utente.setDataScadenza(LocalDate.now().plusYears(1));
    		utente.setUtilizziCard(carrello.getCarta().getUtilizziCard());
    	}
    	
    	if (carrello.getListaOfferte() != null) {
    		for (Offerta offerta : carrello.getListaOfferte()) {
    			AcquistiGadget acquisto = new AcquistiGadget();
    			acquisto.setUtente(utente);
    			acquisto.setOfferta(offerta);
    			acquisto.setDataAcquisto(LocalDate.now());
    			repoAcquisti.save(acquisto);
    		}
    	}
    	repoUtenti.save(utente);
    	carrello.setCarta(null);
    	carrello.getListaOfferte().clear();
    	repoCarrello.save(carrello);
    	return true;
    }
}