package it.made.cinema.Controller;

import it.made.cinema.Model.Offerta;
import it.made.cinema.Model.Utente;
import it.made.cinema.Repository.IRepoUtenti;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/admin/gestioneUtenti")
public class GestioneUtentiController {
    //Form aggiunta, modifica e elimina
    @Autowired
    IRepoUtenti repoUtenti;

    @GetMapping("/formUtente")
    public String formUtente(Model model) {
        model.addAttribute("utente", new Utente());
        return "";
    }

    @PostMapping("/formUtente")
    public String salvaForm(@ModelAttribute("utente") Utente formUtente, BindingResult bindinResult, Model model) {
        if (bindinResult.hasErrors()) {
            return "";
        }
        repoUtenti.save(formUtente);
        return "";
    }

    //modifica
    @GetMapping("/modifica/{id}")
    public String modifica(@PathVariable("id") Integer id, Model model) {
        model.addAttribute("offerta", repoUtenti.findById(id).get());
        return "";
    }

    @PostMapping("/modifica/{id}")
    public String aggiorna(@Valid @ModelAttribute("film") Utente formUtente, BindingResult bindinResult, Model model) {
        if (bindinResult.hasErrors()) {
            return "";
        }
        repoUtenti.save(formUtente);
        return "";
    }

    //elimina
    @PostMapping("/cancella/{id}")
    public String cancella(@PathVariable("id") Integer id) {
        repoUtenti.deleteById(id);
        return "";
    }

}
