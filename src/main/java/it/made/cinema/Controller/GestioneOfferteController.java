package it.made.cinema.Controller;

import it.made.cinema.Model.Film;
import it.made.cinema.Model.Offerta;
import it.made.cinema.Repository.IRepoOfferte;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/admin/gestioneOfferte")
public class GestioneOfferteController {
    @Autowired
    IRepoOfferte repoOfferte;
    Offerta offerta;
    //Form aggiunta, modifica e elimina

    //form per la crezione
    @GetMapping("/formOfferta")
    public String formOfferta(Model model){
        model.addAttribute("offerta", new Offerta());
        return "";
    }

    @PostMapping("/formOfferta")
    public String salvaForm(@ModelAttribute("offerta") Offerta formOfferta,BindingResult bindinResult, Model model){
        if(bindinResult.hasErrors()) {
            return "";
        }
        repoOfferte.save(formOfferta);
        return "";
    }
    //modifica
    @GetMapping ("/modifica/{id}")
    public String modifica(@PathVariable("id") Integer id, Model model) {
        model.addAttribute("offerta",repoOfferte.findById(id).get() );
        return "";
    }
    @PostMapping("/modifica/{id}")
    public String aggiorna(@Valid @ModelAttribute("film") Offerta formOfferta, BindingResult bindinResult, Model model) {
        if(bindinResult.hasErrors()) {
            return "";
        }
        repoOfferte.save(formOfferta);
        return "";
    }
    //elimina
    @PostMapping ("/cancella/{id}")
    public String cancella(@PathVariable("id") Integer id) {
        repoOfferte.deleteById(id);
        return "";
    }


}
