package it.made.cinema.Controller;

import it.made.cinema.Model.Film;
import it.made.cinema.Model.Offerta;
import it.made.cinema.Repository.IRepoFilm;
import it.made.cinema.Repository.IRepoOfferte;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@Controller
@RequestMapping("/")
public class HomeController {
    @Autowired
    IRepoFilm repoFilm;
    @Autowired
    IRepoOfferte repoOfferte;

    //log in da fare
    // bisogna fare un filtro per visualizzare i film in evidenza da decidere che attributo assegnargli soluzione = fare in base ai biglietti aquistati come non lo so e non lo voglio sapere
    // e nel carousel grande da filtrare negli ultimi 7 appena usciti.

    //lista dei film, lista offerte , lista film in Evidenza  da finire
    @GetMapping
    private String home(Model model) {
        List<Film> filmRecenti = repoFilm.findTop7ByOrderByDataDiUscitaDesc();
        List<Offerta> top3Offerte = repoOfferte.findTop3ByOrderByDataInizioDesc();
        List<Film> filmInEvidenza = repoFilm.findFilmEvidenza();
        model.addAttribute("inEvidenza", filmInEvidenza);
        model.addAttribute("filmRecenti", filmRecenti);
        model.addAttribute("top3", top3Offerte);
        return "Home";
    }

    //dettagli dei film
    @GetMapping("/dettagli/{id}")
    private String dettagliHome(@PathVariable("id") Integer id, Model model) {
        model.addAttribute("film", repoFilm.findById(id).get());
        return "filmDettaglio";
    }

    //da fare forse dettagli dei gadgets
    @GetMapping("/dettagliOfferte/{idOfferte}")
    private String dettagliHomeOfferte(@PathVariable("idOfferte") Integer id, Model model){
        model.addAttribute("offerteDettagli", repoOfferte.findById(id).get());
        return "offertaDettaglio";
    }



    /*
    @GetMapping("/dettagli")
    public String dettagli(){
        return "filmDettaglio";
    }

    @GetMapping("/inSala")
    public String inSala(){
        return "inSala";
    }
    @GetMapping("/login")
    public String login(){
        return "login";
    }
    @GetMapping("/membership")
    public String membership(){
        return "membership";
    }
    @GetMapping("/prossimamente")
    public String prossimamente(){
        return "prossimamente";
    }
    */


    // redirect da fare nella home = dettagli(film e shop), shop, prenota ecc.


}
