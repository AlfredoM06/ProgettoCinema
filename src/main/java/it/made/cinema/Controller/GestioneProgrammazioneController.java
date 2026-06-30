package it.made.cinema.Controller;

import it.made.cinema.Model.Film;
import it.made.cinema.Model.ProgrammazioneFilm;
import it.made.cinema.Model.DTO.ListaFilmDTO;
import it.made.cinema.Model.DTO.ListaProgDTO;
import it.made.cinema.Repository.IRepoProgrammazione;
import jakarta.validation.Valid;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/gestioneProgrammazione")
public class GestioneProgrammazioneController {
    @Autowired
    private IRepoProgrammazione repoProgrammazione ;

    @GetMapping
    public String gestioneProgrammazione(Model model){
    	List<ProgrammazioneFilm> listaProgrammazione= repoProgrammazione.findAll();
    	model.addAttribute("listaProgrammazione", listaProgrammazione);
        return "";
    }

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
        repoProgrammazione.save(formProgrammazione);
        return "";
    }

    //modifica
    @GetMapping("/modifica/{id}")
    public String modifica(@PathVariable("id") Integer id, Model model) {
        //passare tutti i dati necessari con le repo
        model.addAttribute("programmazione", repoProgrammazione.findById(id).get());
        return "";
    }

    @PostMapping("/modifica/{id}")
    public String aggiorna(@Valid @ModelAttribute("film") ProgrammazioneFilm formProgrammazione, BindingResult bindinResult, Model model) {
        if (bindinResult.hasErrors()) {
            return "";
        }
       repoProgrammazione.save(formProgrammazione);
        return "";
    }

    //elimina
    @PostMapping("/cancella/{id}")
    public String cancella(@PathVariable("id") Integer id) {
        repoProgrammazione.deleteById(id);
        return "";
    }
    @GetMapping("/programmazione")
    public @ResponseBody List<ListaProgDTO> ricercaProgrammazione(@RequestParam(name = "Giorno", required = false) LocalDate dataProgrammazione){
    	List<ProgrammazioneFilm> programmazioni=null;
    	if(dataProgrammazione!=null) {
    		programmazioni = repoProgrammazione.findByDataProgrammazione(dataProgrammazione);
    	}
    	else {
    		programmazioni = repoProgrammazione.findAll();
    	}
    	List<ListaProgDTO> programmazioneDTO = new ArrayList<>();
    	for (ProgrammazioneFilm programmazione : programmazioni) {
    		programmazioneDTO.add(new ListaProgDTO(
    				programmazione.getId(), 
    				programmazione.getFilm().getId(), 
    				programmazione.getSala().getId(),
    				programmazione.getFilm().getPrezzo(),
    				programmazione.getFilm().getFormato(),
    				programmazione.getOrario(),
    				programmazione.getOrario().plusMinutes(programmazione.getFilm().getDurata()+30)));
    	}
    	return programmazioneDTO;
    }

}
