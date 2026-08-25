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
import it.made.cinema.Service.PrezzoService;
import it.made.cinema.Service.PuntiService;
import org.springframework.beans.factory.annotation.Autowired;
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
    String carrello(Model model, Integer idUtente) {
        Utente utente = repoUtenti.findById(idUtente).get();
        Carrello carrello = repoCarrello.findByUtente(utente);
        if (carrello == null) {
            carrello = creaCarrello(utente);
        }
        List<ListaOffertaDTO> offerteDTO = new ArrayList<ListaOffertaDTO>();
        for (Offerta offerta : carrello.getListaOfferte()) {
            offerteDTO.add(new ListaOffertaDTO(offerta.getId(), offerta.getNome(), offerta.getGenere(), offerta.getDescrizione(), offerta.getImgBanner(), offerta.getPrezzo()));
        }
        CarrelloDTO carello = new CarrelloDTO();
        carello.setListaOfferta(offerteDTO);
        carello.setId(carrello.getId());
        model.addAttribute("carrello", carello);
        return "carrello";
    }

    //metodo per aggiungere al carello
    @PostMapping("/aggiungi/{idUtente}/{idOfferta}")
    @ResponseBody
    private Boolean aggiungi(@RequestParam Integer idUtente, @RequestParam Integer idOfferta) {
        Utente utente = repoUtenti.findById(idUtente).get();
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
    private Boolean elimina(@RequestParam Integer idCarrello, @RequestParam Integer idOfferta) {
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

    //metodo per acquistare e salvare sul db
    @GetMapping("/acquistaOfferta")
    @ResponseBody
    private Double acquistaOfferta(Integer idUtente, Integer idOfferta) {
        Utente utente = repoUtenti.findById(idUtente).get();
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

    @GetMapping("/acquistaCarta")
    @ResponseBody
    private Double acquistaCarta(Integer idUtente, Integer idCarta) {
        Utente utente = repoUtenti.findById(idUtente).get();
        if (utente.getCartaRicaricabile()) {
            return -1d;
        }
        NomeCarta carta = repoCarta.findById(idCarta).get();
        Double prezzo = carta.getPrezzo();
        Carrello carello = repoCarrello.findByUtente(utente);
        carello.setCarta(carta);
        return prezzo;
    }
}