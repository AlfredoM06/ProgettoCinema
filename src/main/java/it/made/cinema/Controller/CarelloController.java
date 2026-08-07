package it.made.cinema.Controller;

import it.made.cinema.Model.Carello;
import it.made.cinema.Model.Offerta;
import it.made.cinema.Model.Utente;
import it.made.cinema.Repository.IRepoCarello;
import it.made.cinema.Repository.IRepoOfferte;
import it.made.cinema.Repository.IRepoUtenti;
import it.made.cinema.Service.PrezzoService;
import it.made.cinema.Service.PuntiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@Controller
@RequestMapping("/carello")
public class CarelloController {

    @Autowired
    IRepoUtenti repoUtenti;

    @Autowired
    IRepoCarello repoCarello;

    @Autowired
    IRepoOfferte repoOfferte;

    @Autowired
    PrezzoService prezzoService;

    //Se l'utente non ha il carello adesso con questo metodo c'è l'ha
    private Carello creaCarello( Utente utente){
        Carello carello = new Carello();

        carello.setUtente(utente);
        repoCarello.save(carello);
    return carello;
    }

    //mostrare carello
    @GetMapping String carello(){
        return "carello";
    }

    //metodo per aggiungere al carello
    @PostMapping("aggiungi/{idUtente}/{idOfferta}")
    @ResponseBody
    private Boolean aggiungi(@RequestParam Integer idUtente, @RequestParam Integer idOfferta){
        Utente utente = repoUtenti.findById(idUtente).get();
        Carello carello = repoCarello.findaByUtente(utente);
        if (carello==null){
            carello = creaCarello(utente);
        }
        Offerta offerta = repoOfferte.findById(idOfferta).get();
        carello.getListaOfferte().add(offerta);
        repoCarello.save(carello);
        return true;
    }

    //metodo per togliere
    @PostMapping("elimina/{idCarello}/{idOfferta}")
    @ResponseBody
    private Boolean elimina(@RequestParam Integer idCarello, @RequestParam Integer idOfferta){
        Carello carello = repoCarello.findById(idCarello).get();
        Offerta offerta = repoOfferte.findById(idOfferta).get();

        for (Offerta o : carello.getListaOfferte()){
            if (o.equals(offerta)){
                carello.getListaOfferte().remove(o);
                break;
            }
        }
        repoCarello.save(carello);

        return true;
    }

    //metodo per acquistare e salvare sul db
    @GetMapping("acquista")
    @ResponseBody
    private Double acquisto(Integer idUtente, Integer idOfferta){
        Utente utente = repoUtenti.findById(idUtente).get();
        Offerta offerta = repoOfferte.findById(idOfferta).get();
        Double prezzo = 0d;
        prezzo = prezzoService.calcolaScontoOfferta(utente,offerta);
        return prezzo;
    }

}
