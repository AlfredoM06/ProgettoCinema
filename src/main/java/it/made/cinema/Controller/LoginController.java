package it.made.cinema.Controller;

import it.made.cinema.Model.Ruolo;
import it.made.cinema.Model.Utente;
import it.made.cinema.Repository.IRepoRuoli;
import it.made.cinema.Repository.IRepoUtenti;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.Collections;
import java.util.Optional;
import java.util.Set;

@Controller
@RequestMapping("/login")
public class LoginController {
    @Autowired
    IRepoRuoli repoRuoli;

    @Autowired
    IRepoUtenti repoUtenti;

    @GetMapping
    public String login(Model model) {
        model.addAttribute("formUtente", new Utente());
        return "SignIn";
    }

    @GetMapping("/login-error")
    public String loginError(Model model) {
        model.addAttribute("formUtente", new Utente());
        model.addAttribute("loginError", true);
        return "SignIn";
    }

    @GetMapping("/registrati")
    public String registrati(Model model){
        Utente utente = new Utente();
        model.addAttribute("formUtente",utente);
        return "SignIn";
    }

    @PostMapping("/registrati")
    public String saveUtente(@Valid @ModelAttribute("formUtente")Utente formUtente, BindingResult bindingResult, RedirectAttributes redirectAttributes, HttpServletRequest httpServletRequest){
        if (bindingResult.hasErrors()){
            return "SignIn";
        }
        formUtente.setPassword("{noop}"+formUtente.getPassword());
        Optional<Ruolo> ruolo = repoRuoli.findById(2);
        if (ruolo.isPresent()){
            formUtente.setRuolo(ruolo.get());
        }
        repoUtenti.save(formUtente);
        redirectAttributes.addFlashAttribute("redirectMessage",
                "Ciao " + formUtente.getUsername() + " la tua registrazione è andata a buon fine!");
        return "redirect:/";
    }
}
