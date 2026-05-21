package it.made.cinema.Controller;

import it.made.cinema.Model.Film;
import it.made.cinema.Repository.IRepoFilm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/admin/gestioneFilm")
public class GestioneFilmController {

    //c'è la pagina
    // gestione drop down con utenti, film e profilo, login e archivio (da vedere come fare)

    @Autowired
    IRepoFilm repoFilm;
    Film film = new Film();

    @GetMapping("/form")
    public String form(Model model){
        model.addAttribute("film", new Film());
        return "/GestioneFilm";
    }

    @PostMapping("/form")
    public String salvaForm(@ModelAttribute("film") Film formFilm, Model model){
        repoFilm.save(formFilm);
        return "redirect:/GestioneFilm";
    }

}
