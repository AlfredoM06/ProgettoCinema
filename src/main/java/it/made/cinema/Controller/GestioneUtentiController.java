package it.made.cinema.Controller;

import it.made.cinema.Model.Offerta;
import it.made.cinema.Model.Utente;
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
            mapUtente.put("ruolo", u.getRuolo());
            listeUtenti.add(mapUtente);
        }
        return listeUtenti;
    }

    //salva/modifica

    //getUtente

    //elimina
    @PostMapping("/cancellaUtente/{id}")
    @ResponseBody
    public Boolean cancella(@PathVariable("id") Integer id) {
        repoUtenti.deleteById(id);
        return true;
    }

}
