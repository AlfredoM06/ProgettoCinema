package it.made.cinema.Controller;

import it.made.cinema.Model.DTO.RegistrazioneDTO;
import it.made.cinema.Model.Ruolo;
import it.made.cinema.Model.Utente;
import it.made.cinema.Repository.IRepoRuoli;
import it.made.cinema.Repository.IRepoUtenti;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;


@Controller
@RequestMapping("/login")
public class LoginController {
    @Autowired
    IRepoRuoli repoRuoli;

    @Autowired
    IRepoUtenti repoUtenti;

    @GetMapping
    public String login() {
        return "SignIn";
    }

    @GetMapping("/login-error")
    public String loginError(Model model) {
        model.addAttribute("loginError", true);
        return "SignIn";
    }

    @PostMapping("/registrati")
    @ResponseBody
    public ResponseEntity<String> saveUtente(@RequestBody RegistrazioneDTO dto) {

        // controlla se username esiste già
        if (repoUtenti.findByUsername(dto.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("Username già esistente");
        }

        Utente utente = new Utente();
        utente.setUsername(dto.getUsername());
        utente.setEmail(dto.getEmail());
        utente.setPassword("{noop}" + dto.getPassword());
        utente.setNome(dto.getNome());
        utente.setCognome(dto.getCognome());
        utente.setDataNascita(dto.getDataNascita());

        Optional<Ruolo> ruolo = repoRuoli.findById(2);
        ruolo.ifPresent(utente::setRuolo); //se il ruolo è presente essendo ruolo un optional, utilizza il metodo setRuolo per settare il ruolo dell'utente (invece di mandere l'oggetto/variabile manda direttamente il metodo)(espressione lambda)

        repoUtenti.save(utente);
        return ResponseEntity.ok("Registrazione avvenuta con successo!");
    }
}
