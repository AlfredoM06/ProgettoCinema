package it.made.cinema.Controller;

import it.made.cinema.Model.Offerta;
import it.made.cinema.Repository.IRepoOfferte;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/admin/gestioneOfferte")
public class GestioneOfferteController {
    @Autowired
    IRepoOfferte repoOfferte;
    //Form aggiunta, modifica e elimina

    @GetMapping
    public String gestioneOfferte(Model model) {
        List<Offerta> listaOfferte = repoOfferte.findAll();
        model.addAttribute("lista", listaOfferte);
        return "Admin";
    }

    //form per la crezione
    @GetMapping("/formOfferta")
    public String formOfferta(Model model) {
        model.addAttribute("offerta", new Offerta());
        return "Admin";
    }

    @PostMapping("/formOfferta")
    public String salvaForm(@ModelAttribute("offerta") Offerta formOfferta, BindingResult bindinResult, Model model) {
        if (bindinResult.hasErrors()) {
            return "Admin";
        }
        repoOfferte.save(formOfferta);
        return "redirect:/Admin";
    }

    //modifica
    @GetMapping("/modificaOfferta/{id}")
    public String modifica(@PathVariable("id") Integer id, Model model) {
        model.addAttribute("offerta", repoOfferte.findById(id).get());
        return "Admin/modificaOfferta";
    }

    @PostMapping("/modificaOfferta/{id}")
    public String aggiorna(@Valid @ModelAttribute("film") Offerta formOfferta, BindingResult bindinResult, Model model) {
        if (bindinResult.hasErrors()) {
            return "Admin/modificaOfferta";
        }
        repoOfferte.save(formOfferta);
        return "redirect:/Admin";
    }

    //elimina
    @PostMapping("/cancellaOfferta/{id}")
    public String cancella(@PathVariable("id") Integer id) {
        repoOfferte.deleteById(id);
        return "redirect:/Admin";
    }


}
