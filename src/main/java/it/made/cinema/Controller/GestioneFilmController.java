package it.made.cinema.Controller;

import it.made.cinema.Model.Film;
import it.made.cinema.Repository.IRepoFilm;
import jakarta.validation.Valid;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/admin/gestioneFilm")
public class GestioneFilmController {

    //c'è la pagina
    // gestione drop down con utenti, film e profilo, login e archivio (da vedere come fare)

    @Autowired
    IRepoFilm repoFilm;
    //Film film;

    //form
    //da fare validazioni form
    @GetMapping("/form")
    public String form(Model model) {
        model.addAttribute("film", new Film());
        return "/GestioneFilm";
    }

    @PostMapping("/form")
    public String salvaForm(@ModelAttribute("film") Film formFilm, Model model) {
        repoFilm.save(formFilm);
        return "redirect:/GestioneFilm";
    }

    @GetMapping
    public String listaArchivio(Model model) {
        List<Film> lista = repoFilm.findAll();
        model.addAttribute("list", lista);
        return "GestioneFilm";
    }

    @GetMapping("/modifica/{id}")
    public String modifica(@PathVariable("id") Integer id, Model model) {
        model.addAttribute("film", repoFilm.findById(id).get());
        return "GestioneFilm/modifica";
    }

    @PostMapping("/modifica/{id}")
    public String aggiorna(@Valid @ModelAttribute("film") Film formFilm, BindingResult bindinResult, Model model) {
        if (bindinResult.hasErrors()) {
            return "GestioneFilm/modifica";
        }
        repoFilm.save(formFilm);
        return "redirect:/GestioneFilm";
    }

    @PostMapping("/cancella/{id}")
    public String cancella(@PathVariable("id") Integer id) {
        repoFilm.deleteById(id);
        return "redirect:/GestioneFilm";
    }
    //da fare:
    //modifica per far tornare disponibile un film da fare in thymeleaf


}
