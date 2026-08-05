package it.made.cinema.Controller;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import it.made.cinema.Model.*;
import it.made.cinema.Repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.server.ResponseStatusException;

import it.made.cinema.Model.DTO.ListaProgDTO;
import it.made.cinema.Service.OrarioService;
import jakarta.validation.Valid;

@Controller
@RequestMapping("/gestioneProgrammazione")
public class GestioneProgrammazioneController {
    @Autowired
    private IRepoProgrammazione repoProgrammazione;

    @Autowired
    OrarioService orarioService;

    @Autowired
    IRepoUtenti repoUtenti;

    @Autowired
    IRepoFilm repoFilm;

    @Autowired
    IRepoSala repoSala;

    @Autowired
    IRepoPosto repoPosto;


    @GetMapping
    public String gestioneProgrammazione(Model model) {
        List<ProgrammazioneFilm> listaProgrammazione = repoProgrammazione.findAll();
        model.addAttribute("listaProgrammazione", listaProgrammazione);
        return "Admin";
    }

    //form per la crezione
    @GetMapping("/formProgrammazione")
    public String formPartner(Model model) {
        model.addAttribute("programmazione", new ProgrammazioneFilm());
        return "Admin";
    }

    @PostMapping("/formProgrammazione")
    public String salvaForm(@ModelAttribute("programmazione") ProgrammazioneFilm formProgrammazione, BindingResult bindinResult, Model model) {
        if (bindinResult.hasErrors()) {
            return "Admin";
        }
        repoProgrammazione.save(formProgrammazione);
        return "redirect:/Admin";
    }

    //modifica
    @GetMapping("/modificaProgrammazione/{id}")
    public String modifica(@PathVariable("id") Integer id, Model model) {
        //passare tutti i dati necessari con le repo
        model.addAttribute("programmazione", repoProgrammazione.findById(id).get());
        return "Admin";
    }

    @PostMapping("/modificaProgrammazione/{id}")
    public String aggiorna(@Valid @ModelAttribute("film") ProgrammazioneFilm formProgrammazione, BindingResult bindinResult, Model model) {
        if (bindinResult.hasErrors()) {
            return "Admin/modificaProgrammazione";
        }
        repoProgrammazione.save(formProgrammazione);
        return "redirect:/Admin";
    }

    //elimina
    @PostMapping("/cancellaProgrammazione/{id}")
    public String cancella(@PathVariable("id") Integer id) {
        repoProgrammazione.deleteById(id);
        return "redirect:/Admin";
    }

    @GetMapping("/programmazione")
    public @ResponseBody List<ListaProgDTO> ricercaProgrammazione(@RequestParam(name = "Giorno", required = false) LocalDate dataProgrammazione) {
        List<ProgrammazioneFilm> programmazioni = null;
        if (dataProgrammazione != null) {
            programmazioni = repoProgrammazione.findByDataProgrammazione(dataProgrammazione);
        } else {
            programmazioni = repoProgrammazione.findAll();
        }
        List<ListaProgDTO> programmazioneDTO = new ArrayList<>();
        for (ProgrammazioneFilm programmazione : programmazioni) {
            programmazioneDTO.add(new ListaProgDTO(
                    programmazione.getId(),
                    programmazione.getFilm().getId(),
                    programmazione.getSala().getId(),
                    programmazione.getFilm().getPrezzo(),
                    programmazione.getSala().getFormato(),
                    programmazione.getOrario(),
                    programmazione.getOrario().plusMinutes(programmazione.getFilm().getDurata() + 30)));
        }
        return programmazioneDTO;
    }

    @GetMapping("/programmazione/oreMancanti/{idProgrammazione}/{id}")
    @ResponseBody
    public Boolean oreMancati(@PathVariable Integer idProgrammazione, @PathVariable Integer id) {

        Optional<Utente> utenteOpt = repoUtenti.findById(id);
        if (utenteOpt.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Utente non trovato");
        }
        Utente utente = utenteOpt.get();
        ProgrammazioneFilm programmazione = repoProgrammazione.findById(idProgrammazione).get();

        return Boolean.TRUE.equals(utente.getMembership()) ||
                Boolean.TRUE.equals(orarioService.oreMancanti(programmazione.getDataProgrammazione(), programmazione.getOrario()));

    }

    // quando si clicca su di una programmazione di un film, ti porta alla pagina della "sala" in cui vai a restituire la matrice che hai creato con il service
    @GetMapping("/dettagliProgrammazione/{idProgrammazione}")
    public String programmazione(@PathVariable Integer idProgrammazione, Model model){

        ProgrammazioneFilm programmazione = repoProgrammazione.findById(idProgrammazione).get();
        Film film = repoFilm.findById(programmazione.getFilm().getId()).get();
        Sala sala = repoSala.findById(programmazione.getSala().getId()).get();
        List<Posto> posti = repoPosto.findAll();
        model.addAttribute("posti", posti);
        model.addAttribute("titolo", film.getTitolo());
        model.addAttribute("poster", film.getImg_poster());
        model.addAttribute("sala", sala.getId());
        model.addAttribute("formato", sala.getFormato());
        model.addAttribute("data", programmazione.getDataProgrammazione());
        model.addAttribute("inizio", programmazione.getOrario());
        model.addAttribute("fine", programmazione.getOrario().plusMinutes(film.getDurata() + 30));

        return "prenotazioneBiglietto";
    }

}