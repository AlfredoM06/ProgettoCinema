package it.made.cinema.Controller;

import it.made.cinema.Model.Offerta;
import it.made.cinema.Model.Partnership;
import it.made.cinema.Repository.IRepoOfferte;
import it.made.cinema.Repository.IRepoPartnership;
import jakarta.servlet.http.Part;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/admin/gestionePartnership")
public class GestionePartnershipController {

    @Autowired
    IRepoPartnership repoPartnership;
    //Form aggiunta, modifica e elimina

    //form per la crezione
    @GetMapping("/formPartner")
    public String formPartner(Model model) {
        model.addAttribute("partner", new Partnership());
        return "";
    }

    @PostMapping("/formPartner")
    public String salvaForm(@ModelAttribute("partner") Partnership formPartner, BindingResult bindinResult, Model model) {
        if (bindinResult.hasErrors()) {
            return "";
        }
        repoPartnership.save(formPartner);
        return "";
    }

    //modifica
    @GetMapping("/modifica/{id}")
    public String modifica(@PathVariable("id") Integer id, Model model) {
        model.addAttribute("offerta", repoPartnership.findById(id).get());
        return "";
    }

    @PostMapping("/modifica/{id}")
    public String aggiorna(@Valid @ModelAttribute("film") Partnership formPartner, BindingResult bindinResult, Model model) {
        if (bindinResult.hasErrors()) {
            return "";
        }
        repoPartnership.save(formPartner);
        return "";
    }

    //elimina
    @PostMapping("/cancella/{id}")
    public String cancella(@PathVariable("id") Integer id) {
        repoPartnership.deleteById(id);
        return "";
    }
}
