package it.made.cinema.Controller;

import it.made.cinema.Model.*;
import it.made.cinema.Model.DTO.GestioneOfferteDTO;
import it.made.cinema.Model.DTO.GestioneUtenteDTO;
import it.made.cinema.Repository.IRepoRuoli;
import it.made.cinema.Repository.IRepoUtenti;
import jakarta.validation.Valid;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
    @Autowired
    IRepoRuoli repoRuoli;

    //lista
    @GetMapping("/listaUtenti")
    @ResponseBody
    public List<Map<String, Object>> listaUtenti(){
        List<Utente> utenti = repoUtenti.findAll();
        List<Map<String, Object>> listeUtenti = new ArrayList<>();
        for (Utente u : utenti){
            Map<String, Object> mapUtente = new HashMap<>();
            mapUtente.put("id", u.getId());
            mapUtente.put("nome", u.getNome());
            mapUtente.put("cognome", u.getCognome());
            mapUtente.put("email", u.getEmail());
            mapUtente.put("ruolo", u.getRuolo().getNome());
            listeUtenti.add(mapUtente);
        }
        return listeUtenti;
    }

    //creare metodo getRuoli che restituisce una lista di id e nome ruolo(gia fatto in film)
    @GetMapping("/listaRuoli")
    public @ResponseBody Map<Integer, String> getRuoli() {
        List<Ruolo> lista = repoRuoli.findAll();
        Map<Integer, String> ruoli = new HashMap<Integer, String>();
        for (Ruolo r : lista) {
            ruoli.put(r.getId(), r.getNome());
        }
        return ruoli;
    }

    //salva/modifica
    @PostMapping("/salvaUtente")
    @ResponseBody
    public Boolean salvaUtente(@RequestBody GestioneUtenteDTO utenteDTO){
        Utente utente = new Utente();
        utente.setId(utenteDTO.getId());
        utente.setNome(utenteDTO.getNome());
        utente.setCognome(utenteDTO.getCognome());
        utente.setEmail(utenteDTO.getEmail());
        if (!(utenteDTO.getIdRuolo() == null)){
            Ruolo ruolo = repoRuoli.findById(utenteDTO.getIdRuolo()).get();
            utente.setRuolo(ruolo);
        }
        repoUtenti.save(utente);
        return true;
    }



    //getUtente
    @GetMapping("/getUtente/{id}")
    @ResponseBody
    public GestioneUtenteDTO getUtente (@PathVariable (name = "id") Integer id){
        Utente utente = repoUtenti.findById(id).get();
        GestioneUtenteDTO dto = new GestioneUtenteDTO();
        dto.setId(utente.getId());
        dto.setNome(utente.getNome());
        dto.setCognome(utente.getCognome());
        dto.setEmail(utente.getEmail());
        if (utente.getRuolo() != null){
            dto.setIdRuolo(utente.getRuolo().getId());
        }
        return dto;
    }

    //elimina
    @PostMapping("/cancellaUtente/{id}")
    @ResponseBody
    public Boolean cancella(@PathVariable("id") Integer id) {
        repoUtenti.deleteById(id);
        return true;
    }

}
