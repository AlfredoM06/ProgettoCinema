package it.made.cinema.Controller;

import it.made.cinema.Model.Partnership;
import it.made.cinema.Model.ProgrammazioneFilm;
import it.made.cinema.Repository.IRepoPartnership;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/gestioneProgrammazione")
public class GestioneProgrammazioneController {
    @Autowired
    //IRepoProgrammazione ;


    //form per la crezione
    @GetMapping("/formProgrammazione")
    public String formPartner(Model model) {
        model.addAttribute("programmazione", new ProgrammazioneFilm());
        return "";
    }

    @PostMapping("/formProgrammazione")
    public String salvaForm(@ModelAttribute("programmazione") ProgrammazioneFilm formProgrammazione, BindingResult bindinResult, Model model) {
        if (bindinResult.hasErrors()) {
            return "";
        }
        //repoPartnership.save(formPartner);
        return "";
    }

    //modifica
    @GetMapping("/modifica/{id}")
    public String modifica(@PathVariable("id") Integer id, Model model) {
       // model.addAttribute("offerta", repoPartnership.findById(id).get());
        return "";
    }

    @PostMapping("/modifica/{id}")
    public String aggiorna(@Valid @ModelAttribute("film") ProgrammazioneFilm formProgrammazione, BindingResult bindinResult, Model model) {
        if (bindinResult.hasErrors()) {
            return "";
        }
       //repoPartnership.save(formPartner);
        return "";
    }

    //elimina
    @PostMapping("/cancella/{id}")
    public String cancella(@PathVariable("id") Integer id) {
       // repoPartnership.deleteById(id);
        return "";
    }
}
