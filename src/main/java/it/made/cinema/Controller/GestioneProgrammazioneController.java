package it.made.cinema.Controller;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;

import it.made.cinema.Model.*;
import it.made.cinema.Model.DTO.ArchivioProgrammazioniDTO;
import it.made.cinema.Model.DTO.SalvaProgrammazioneDTO;
import it.made.cinema.Repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import it.made.cinema.Model.DTO.ListaProgDTO;
import it.made.cinema.Service.OrarioService;

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

    @Autowired
    IRepoPostiOccupati repoPostiOccupati;

    @GetMapping("/getOrariPerSala/{idSala}/{data}")
    @ResponseBody
    public Map<?, ?> getOrariPerSala(@PathVariable Integer idSala, @PathVariable LocalDate data) {

        List<ProgrammazioneFilm> programmazioni = repoProgrammazione.findByDataProgrammazioneAndSalaId(data, idSala);
        Map<LocalTime, Integer> result = new HashMap<>();
        for (ProgrammazioneFilm p : programmazioni) {
            result.put(p.getOrario(), p.getFilm().getDurata());
        }
        return result;
    }

    @GetMapping("/listaProgrammazioni")
    @ResponseBody
    public List<ArchivioProgrammazioniDTO> listaProgrammazioni(){
        List< ArchivioProgrammazioniDTO> listaProgrammazioni = repoProgrammazione.findAllGroupByDataProgrammazione();
        return listaProgrammazioni;
    }


    @PostMapping("/salvaProgrammazione")
    @ResponseBody
    public Boolean salvaForm(@RequestBody SalvaProgrammazioneDTO dto) {
        Film film = repoFilm.findById(dto.getIdFilm()).get();
        Sala sala = repoSala.findById(dto.getIdSala()).get();
        ProgrammazioneFilm programmazioneFilm = new ProgrammazioneFilm();
        programmazioneFilm.setFilm(film);
        programmazioneFilm.setSala(sala);
        programmazioneFilm.setDataProgrammazione(dto.getData());
        programmazioneFilm.setOrario(dto.getOrario());
        repoProgrammazione.save(programmazioneFilm);
        return true;
    }

    //modifica
    @GetMapping("/getOrari/{idFilm}/{idSala}/{data}")
    @ResponseBody
    public Map<?, ?> getOrari(@PathVariable Integer idFilm, @PathVariable Integer idSala, @PathVariable LocalDate data) {

        List<ProgrammazioneFilm> programmazioni = repoProgrammazione.findByDataProgrammazioneAndFilmIdAndSalaId(data, idFilm, idSala);
        Map<LocalTime, Integer> result = new HashMap<>();
        for (ProgrammazioneFilm p : programmazioni) {
            result.put(p.getOrario(), p.getFilm().getDurata());
        }
        return result;
    }

    //elimina
    @PostMapping("/cancellaProgrammazione/{idFilm}/{idSala}/{data}")
    @ResponseBody
    public Boolean cancella(@PathVariable Integer idFilm, @PathVariable Integer idSala, @PathVariable LocalDate data) {
        List<ProgrammazioneFilm> programmazioni = repoProgrammazione.findByDataProgrammazioneAndFilmIdAndSalaId(data, idFilm, idSala);
        for (ProgrammazioneFilm p : programmazioni) {
            repoPostiOccupati.deleteByProgrammazioneFilm(p);
            repoProgrammazione.deleteById(p.getId());
        }
        return true;
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
    public String programmazione(@PathVariable Integer idProgrammazione, Model model) {

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