package it.made.cinema.Controller;

import it.made.cinema.Model.*;
import it.made.cinema.Model.DTO.*;
import it.made.cinema.Repository.IRepoFilm;
import it.made.cinema.Repository.IRepoOfferte;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.ArrayList;
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
        List<ListaFilmRecentiDTO> filmRecentiDTO = new ArrayList<>();
        for (Film recente : filmRecenti) {
            filmRecentiDTO.add(new ListaFilmRecentiDTO(recente.getId(), recente.getTitolo(), recente.getImg_poster(), recente.getDataDiUscita(), recente.getDescrizione(), recente.getDurata(), recente.getImg_cover(), recente.getImg_logo()));
        }

        //List<Film> filmInEvidenza = repoFilm.findFilmEvidenza();
        //model.addAttribute("inEvidenza", filmInEvidenza);
        model.addAttribute("filmRecenti", filmRecentiDTO);
        return "Home";
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
