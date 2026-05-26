package it.made.cinema.Controller;

import it.made.cinema.Model.Film;
import it.made.cinema.Model.Gadget;
import it.made.cinema.Repository.IRepoFilm;
import it.made.cinema.Repository.IRepoGadget;
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
    IRepoGadget repoGadget;
    //c'è la pagina
    //prenota(redirect), vedi tutti gadget(redirect)
    //log in
    //lista dei film, lista gadgets
    @GetMapping
    private String home(Model model){
        List<Film> listaFilmHome = repoFilm.findAll();
        List<Gadget> listaGadgetHome = repoGadget.findAll();
        model.addAttribute("listaFilm", listaFilmHome);
        model.addAttribute("listaGadget", listaGadgetHome);
        return "Home";
    }

    //dettagli dei film, dettagli dei gadgets
    @GetMapping("/dettagli/{id}")
    private String dettagliHome(@PathVariable("id") Integer id, Model model){
        model.addAttribute("film", repoFilm.findById(id).get());
        model.addAttribute("gadget", repoGadget.findById(id).get());
        return "";
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
