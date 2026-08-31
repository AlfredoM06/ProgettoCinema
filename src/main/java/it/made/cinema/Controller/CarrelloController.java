package it.made.cinema.Controller;

import it.made.cinema.Model.Carrello;
import it.made.cinema.Model.NomeCarta;
import it.made.cinema.Model.Offerta;
import it.made.cinema.Model.Utente;
import it.made.cinema.Model.DTO.CarrelloDTO;
import it.made.cinema.Model.DTO.ListaOffertaDTO;
import it.made.cinema.Repository.IRepoCarrello;
import it.made.cinema.Repository.IRepoCarta;
import it.made.cinema.Repository.IRepoOfferte;
import it.made.cinema.Repository.IRepoUtenti;
import it.made.cinema.Security.DatabaseUserDetails;
import it.made.cinema.Service.PrezzoService;
import it.made.cinema.Service.PuntiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

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
    PrezzoService prezzoService;

    //Se l'utente non ha il carello adesso con questo metodo c'è l'ha
    private Carrello creaCarrello(Utente utente) {
        Carrello carrello = new Carrello();

        carrello.setUtente(utente);
        repoCarrello.save(carrello);
        return carrello;
    }

    //mostrare carello
    @GetMapping
    String carrello(Model model, Authentication authentication) {
    	DatabaseUserDetails userDetails = (DatabaseUserDetails) authentication.getPrincipal();
        Utente utente = repoUtenti.findById(userDetails.getId()).get();
        Carrello carrello = repoCarrello.findByUtente(utente);
        if (carrello == null) {
            carrello = creaCarrello(utente);
        }
        if (carrello.getListaOfferte() == null) {
            carrello.setListaOfferte(new ArrayList<>());
        }
        List<ListaOffertaDTO> offerteDTO = new ArrayList<ListaOffertaDTO>();
        for (Offerta offerta : carrello.getListaOfferte()) {
            offerteDTO.add(new ListaOffertaDTO(offerta.getId(), offerta.getNome(), offerta.getGenere(), offerta.getDescrizione(), offerta.getImgBanner(), offerta.getPrezzo(), offerta.getDataInizio()));
        }
        CarrelloDTO carello = new CarrelloDTO();
        carello.setListaOfferta(offerteDTO);
        carello.setId(carrello.getId());
        model.addAttribute("carrello", carello);
        return "carrello";
    }

    //metodo per aggiungere al carello
    @PostMapping("/aggiungi/{idOfferta}")
    @ResponseBody
    private Boolean aggiungi(Authentication authentication, @PathVariable Integer idOfferta) {
    	DatabaseUserDetails userDetails = (DatabaseUserDetails) authentication.getPrincipal();
        Utente utente = repoUtenti.findById(userDetails.getId()).get();
        Carrello carello = repoCarrello.findByUtente(utente);
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
    private Boolean elimina(@PathVariable Integer idCarrello, @PathVariable Integer idOfferta) {
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
    @GetMapping("/acquistaOfferta/{idOfferta}")
    @ResponseBody
    private Double acquistaOfferta(Authentication authentication, @PathVariable Integer idOfferta) {
    	DatabaseUserDetails userDetails = (DatabaseUserDetails) authentication.getPrincipal();
        Utente utente = repoUtenti.findById(userDetails.getId()).get();
        Offerta offerta = repoOfferte.findById(idOfferta).get();
        Double prezzo = 0d;
        prezzo = prezzoService.calcolaScontoOfferta(utente, offerta);
        Carrello carello = repoCarrello.findByUtente(utente);
        if (carello.getListaOfferte() == null) {
            carello.setListaOfferte(new ArrayList<>());
        }
        carello.getListaOfferte().add(offerta);
        return prezzo;
    }

    @GetMapping("/acquistaCarta/{idCarta}")
    @ResponseBody
    private Double acquistaCarta(Authentication authentication, @PathVariable Integer idCarta) {
    	DatabaseUserDetails userDetails = (DatabaseUserDetails) authentication.getPrincipal();
        Utente utente = repoUtenti.findById(userDetails.getId()).get();
        if (utente.getCartaRicaricabile()) {
            return -1d;
        }
        NomeCarta carta = repoCarta.findById(idCarta).get();
        Double prezzo = carta.getPrezzo();
        Carrello carello = repoCarrello.findByUtente(utente);
        carello.setCarta(carta);
        return prezzo;
    }
    
    @GetMapping("/acquistaMembership")
    @ResponseBody
    private Double acquistaMembership(Authentication authentication) {
    	DatabaseUserDetails userDetails = (DatabaseUserDetails) authentication.getPrincipal();    
    	Utente utente = repoUtenti.findById(userDetails.getId()).get();
    	Carrello carello =repoCarrello.findByUtente(utente);
    	carello.setMembership(true);
    	Double prezzo = 4.90;
    	return prezzo;
    	}
    
    //Acquisto membership

}