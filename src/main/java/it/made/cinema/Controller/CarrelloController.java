package it.made.cinema.Controller;

import it.made.cinema.Model.AcquistiGadget;
import it.made.cinema.Model.Carrello;
import it.made.cinema.Model.NomeCarta;
import it.made.cinema.Model.Offerta;
import it.made.cinema.Model.RigaCarrello;
import it.made.cinema.Model.Utente;
import it.made.cinema.Model.DTO.CarrelloDTO;
import it.made.cinema.Model.DTO.ListaOffertaDTO;
import it.made.cinema.Repository.IRepoAcquisti;
import it.made.cinema.Repository.IRepoCarrello;
import it.made.cinema.Repository.IRepoCarta;
import it.made.cinema.Repository.IRepoOfferte;
import it.made.cinema.Repository.IRepoRigaCarrello;
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
    
    @Autowired IRepoRigaCarrello rigaCarrello;

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
        if (carrello.getRigheCarrello() == null) {
            carrello.setRigheCarrello(new ArrayList<>());
        }
        List<ListaOffertaDTO> offerteDTO = new ArrayList<ListaOffertaDTO>();
        Double prezzoTotale = 0d;
        for (RigaCarrello riga : carrello.getRigheCarrello()) {
        	Offerta offerta = riga.getOfferta();
            Double prezzoScontato = prezzoService.calcolaScontoOfferta(utente,offerta);
        	prezzoTotale += prezzoScontato * riga.getQuantita();
        	Double valoreSconto = offerta.getPrezzo() - prezzoScontato;
            offerteDTO.add(new ListaOffertaDTO(offerta.getId(), 
            		offerta.getNome(), 
            		offerta.getGenere(), 
            		offerta.getDescrizione(), 
            		offerta.getImgBanner(), 
            		offerta.getPrezzo(), 
            		prezzoScontato, 
            		offerta.getDataInizio(), 
            		valoreSconto,
            		riga.getQuantita()));
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

    //metodo per togliere
    @PostMapping("/elimina/{idCarrello}/{idOfferta}")
    @ResponseBody
    public Boolean elimina(@PathVariable Integer idCarrello, @PathVariable Integer idOfferta) {
        Carrello carrello = repoCarrello.findById(idCarrello).get();
        carrello.getRigheCarrello().removeIf(riga -> riga.getOfferta().getId().equals(idOfferta));
        repoCarrello.save(carrello);
        return true;
    }

    //elimina singolo item
    @PostMapping("/rimuoviUno/{idOfferta}")
    @Transactional
    @ResponseBody
    public Boolean rimuoviUno(Authentication authentication, @PathVariable Integer idOfferta) {
        DatabaseUserDetails userDetails = (DatabaseUserDetails) authentication.getPrincipal();
        Utente utente = repoUtenti.findById(userDetails.getId()).get();
        Carrello carrello = repoCarrello.findByUtenteId(utente.getId());

        if (carrello == null) {
            return false;
        }

        if (carrello.getRigheCarrello() == null) {
            carrello.setRigheCarrello(new ArrayList<>());
        }

        // Rimuove UNA sola copia dell'offerta
        for (RigaCarrello riga : carrello.getRigheCarrello()) {
            if (riga.getOfferta().getId().equals(idOfferta)) {
            	if(riga.getQuantita()>1) {
            		riga.setQuantita(riga.getQuantita()-1);
            	} else {
            		carrello.getRigheCarrello().remove(riga);
            	}
                break;
            }
        }

        repoCarrello.save(carrello);
        return true;
    }
        // Creo il DTO da restituire al frontend


    //metodo per acquistare e salvare sul db l'offerta che l'utente ha acquistato
    @PostMapping("/acquistaOfferta/{idOfferta}")
    @Transactional
    @ResponseBody
    public Boolean acquistaOfferta(Authentication authentication, @PathVariable Integer idOfferta) {
    	DatabaseUserDetails userDetails = (DatabaseUserDetails) authentication.getPrincipal();
    	Utente utente = repoUtenti.findById(userDetails.getId()).orElse(null);
    	Carrello carrello = repoCarrello.findByUtenteId(utente.getId());
    	if (carrello == null) {
    		carrello= creaCarrello(utente);
    	}
    	if(carrello.getRigheCarrello()== null) {
    		carrello.setRigheCarrello(new ArrayList<>());
    	}
    	Offerta offerta = repoOfferte.findById(idOfferta).get();
    	RigaCarrello rigaEsistente = null;
    	for(RigaCarrello riga : carrello.getRigheCarrello()) {
    		if(riga.getOfferta().getId().equals(idOfferta)) {
    			rigaEsistente = riga;
    			break;
    		}
    	}
    	if(rigaEsistente != null) {
    		rigaEsistente.setQuantita(rigaEsistente.getQuantita()+1);
    	} else {
    		RigaCarrello nuovaRiga = new RigaCarrello();
    		nuovaRiga.setCarrello(carrello);
    		nuovaRiga.setOfferta(offerta);
    		nuovaRiga.setQuantita(1);
    		carrello.getRigheCarrello().add(nuovaRiga);
    	}
    	repoCarrello.save(carrello);
    	return true;
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

        NomeCarta carta = repoCarta.findById(idCarta).get();

        Carrello carrello = repoCarrello.findByUtenteId(utente.getId());

        if (carrello == null) {
            carrello = creaCarrello(utente);
        }

        // ← AGGIUNTO — c'è già una carta nel carrello
        if (carrello.getCarta() != null) {
            return ResponseEntity.badRequest().body(-2d);
        }

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
        if (carrello.getRigheCarrello() != null) {
            for (RigaCarrello riga : carrello.getRigheCarrello()) {
            	Offerta offerta = riga.getOfferta();
                prezzoFinale += prezzoService.calcolaScontoOfferta(utente, offerta) * riga.getQuantita();
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
        if (carrello.getRigheCarrello() != null) {
            for (RigaCarrello riga: carrello.getRigheCarrello()) {
            	Offerta offerta = riga.getOfferta();
            	AcquistiGadget acquisto = new AcquistiGadget();
            	acquisto.setUtente(utente);
            	acquisto.setOfferta(offerta);
            	acquisto.setDataAcquisto(LocalDate.now());
            	acquisto.setQuantità(riga.getQuantita());
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
        carrello.getRigheCarrello().clear();
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