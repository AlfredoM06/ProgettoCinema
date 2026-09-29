package it.made.cinema.Controller;

import it.made.cinema.Model.Ruolo;
import it.made.cinema.Model.Utente;
import it.made.cinema.Model.DTO.GestioneUtenteDTO;
import it.made.cinema.Repository.IRepoRuoli;
import it.made.cinema.Repository.IRepoUtenti;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/admin/gestioneUtenti")
public class GestioneUtentiController {

    @Autowired
    IRepoUtenti repoUtenti;

    @Autowired
    IRepoRuoli repoRuoli;


    // LISTA UTENTI
    @GetMapping("/listaUtenti")
    @ResponseBody
    public List<Map<String, Object>> listaUtenti() {
        List<Utente> utenti = repoUtenti.findAll();
        List<Map<String, Object>> listaUtenti = new ArrayList<>();
        for (Utente u : utenti) {
            Map<String, Object> mapUtente = new HashMap<>();
            mapUtente.put("id", u.getId());
            mapUtente.put("username", u.getUsername());
            mapUtente.put("nome", u.getNome());
            mapUtente.put("cognome", u.getCognome());
            mapUtente.put("email", u.getEmail());

            if (u.getRuolo() != null) {
                mapUtente.put("ruolo", u.getRuolo().getNome());
            } else {
                mapUtente.put("ruolo", "");
            }
            listaUtenti.add(mapUtente);
        }
        return listaUtenti;
    }


    // LISTA RUOLI

    @GetMapping("/listaRuoli")
    @ResponseBody
    public Map<Integer, String> getRuoli() {
        List<Ruolo> lista = repoRuoli.findAll();
        Map<Integer, String> ruoli = new HashMap<>();
        for (Ruolo r : lista) {
            ruoli.put(r.getId(), r.getNome());
        }
        return ruoli;
    }


    // SALVA / MODIFICA UTENTE

    @PostMapping("/salvaUtente")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> salvaUtente(@RequestBody GestioneUtenteDTO utenteDTO) {
        Map<String, Object> risposta = new HashMap<>();

        // CONTROLLO DATI OBBLIGATORI
        if (utenteDTO.getUsername() == null ||
                utenteDTO.getUsername().trim().isEmpty() ||
                utenteDTO.getEmail() == null ||
                utenteDTO.getEmail().trim().isEmpty() ||
                utenteDTO.getIdRuolo() == null) {

            risposta.put("success", false);
            risposta.put("message", "Compila username, email e ruolo.");
            return ResponseEntity.badRequest().body(risposta);
        }
        String username = utenteDTO.getUsername().trim();
        String email = utenteDTO.getEmail().trim();


        // RECUPERO RUOLO
        Optional<Ruolo> ruoloOptional = repoRuoli.findById(utenteDTO.getIdRuolo());
        if (ruoloOptional.isEmpty()) {
            risposta.put("success", false);
            risposta.put("message", "Il ruolo selezionato non esiste.");
            return ResponseEntity.badRequest().body(risposta);
        }
        Ruolo ruolo = ruoloOptional.get();


        // MODIFICA UTENTE
        if (utenteDTO.getId() != null) {
            Optional<Utente> utenteOptional = repoUtenti.findById(utenteDTO.getId());
            if (utenteOptional.isEmpty()) {
                risposta.put("success", false);
                risposta.put("message", "Utente non trovato.");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(risposta);
            }
            Utente utente = utenteOptional.get();

            // Modifichiamo solo i dati necessari
            utente.setUsername(username);
            utente.setEmail(email);
            utente.setRuolo(ruolo);
            repoUtenti.save(utente);
            risposta.put("success", true);
            risposta.put("message", "Utente modificato con successo.");
            return ResponseEntity.ok(risposta);
        }

        // NUOVO AGGIORNAMENTO UTENTE
        Optional<Utente> utenteCompleto = repoUtenti.findByUsernameAndEmail(username, email);

        // USERNAME + EMAIL CORRETTI
        if (utenteCompleto.isPresent()) {
            Utente utente = utenteCompleto.get();
            utente.setRuolo(ruolo);
            repoUtenti.save(utente);
            risposta.put("success", true);
            risposta.put("message", "Utente aggiornato con successo.");
            return ResponseEntity.ok(risposta);
        }


        // CONTROLLO SE USERNAME ED EMAIL ESISTONO SEPARATAMENTE
        Optional<Utente> utenteUsername = repoUtenti.findByUsername(username);
        boolean usernameCorretto = utenteUsername.isPresent();
        boolean emailCorretta = repoUtenti.findAll().stream().anyMatch(u -> u.getEmail() != null && u.getEmail().equalsIgnoreCase(email));
        // USERNAME CORRETTO - EMAIL SBAGLIATA
        if (usernameCorretto && !emailCorretta) {
            risposta.put("success", false);
            risposta.put("message", "Email sbagliata.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(risposta);
        }
        // USERNAME SBAGLIATO - EMAIL CORRETTA
        if (!usernameCorretto && emailCorretta) {
            risposta.put("success", false);
            risposta.put("message", "Username sbagliato.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(risposta);
        }
        // USERNAME + EMAIL SBAGLIATI
        risposta.put("success", false);
        risposta.put("message", "Utente non esistente, riprovare.");
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(risposta);
    }


    // GET UTENTE
    @GetMapping("/getUtente/{id}")
    @ResponseBody
    public ResponseEntity<GestioneUtenteDTO> getUtente(@PathVariable("id") Integer id) {
        Optional<Utente> utenteOptional = repoUtenti.findById(id);
        if (utenteOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Utente utente = utenteOptional.get();
        GestioneUtenteDTO dto = new GestioneUtenteDTO();
        dto.setId(utente.getId());
        dto.setUsername(utente.getUsername());
        dto.setNome(utente.getNome());
        dto.setCognome(utente.getCognome());
        dto.setEmail(utente.getEmail());

        if (utente.getRuolo() != null) {
            dto.setIdRuolo(utente.getRuolo().getId());
        }
        return ResponseEntity.ok(dto);
    }


    // ELIMINA UTENTE
    @PostMapping("/cancellaUtente/{id}")
    @ResponseBody
    public Boolean cancella(@PathVariable("id") Integer id) {
        repoUtenti.deleteById(id);
        return true;
    }
}