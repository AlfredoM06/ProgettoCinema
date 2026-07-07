package it.made.cinema.Controller;

import it.made.cinema.Model.Film;
import it.made.cinema.Repository.IRepoFilm;
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

    //@Autowired
    //IRepoGadget repoGadget;
    //c'è la pagina
    //prenota(redirect), vedi tutti gadget(redirect)
    //log in
    //lista dei film, lista gadgets
    @GetMapping
    private String home(Model model) {
        List<Film> listaFilmHome = repoFilm.findAll();
        //List<Gadget> listaGadgetHome = repoGadget.findAll();
        model.addAttribute("listaFilm", listaFilmHome);
        //model.addAttribute("listaGadget", listaGadgetHome);
        return "Home";
    }

    // bisogna fare un filtro per visualizzare i film in evidenza da decidere che attributo assegnargli.
    // e nel carousel grande da filtrare negli ultimi 7 appena usciti.

    //dettagli dei film
    @GetMapping("/dettagli/{id}")
    private String dettagliHome(@PathVariable("id") Integer id, Model model) {
        model.addAttribute("film", repoFilm.findById(id).get());
        return "filmDettaglio";
    }

    //da fare forse dettagli dei gadgets



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
