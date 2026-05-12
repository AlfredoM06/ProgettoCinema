package it.made.cinema.Controller;

import it.made.cinema.Model.Film;
import it.made.cinema.Repository.IRepoFilm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@Controller
@RequestMapping("/inSala")
public class InSalaController {
    //lista di film
    //barra di ricerca
    //da vedere come si fa
    @Autowired
    private IRepoFilm repoFilm;
/*
    @GetMapping
    public String listaFilm(Model model){
        List<Film> lista = repoFilm.findAll();
        model.addAttribute("list", lista);
        return "inSala";
    }



@PostMapping()
    public String form(){
        return "redirect: /inSala";
}
*/
}
