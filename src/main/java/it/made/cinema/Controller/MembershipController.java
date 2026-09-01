package it.made.cinema.Controller;

import it.made.cinema.Model.Utente;
import it.made.cinema.Repository.IRepoUtenti;
import it.made.cinema.Security.DatabaseUserDetails;
import it.made.cinema.Service.PuntiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping("/membership")
public class MembershipController {

    @Autowired
    IRepoUtenti repoUtenti;

    @Autowired
    PuntiService puntiService;

    @GetMapping
    public String index(){
        return "membership";
    }

    //fare acquisto
    @PostMapping("/membershipAcquistata")
    @ResponseBody
    public ResponseEntity<String> acquisto(Authentication authentication) {

        DatabaseUserDetails userDetails = (DatabaseUserDetails) authentication.getPrincipal();
        Utente utente = repoUtenti.findById(userDetails.getId()).get();

        // Se ha già la membership non fare nulla
        if (Boolean.TRUE.equals(utente.getMembership())) {
            return ResponseEntity.badRequest().body("Hai già la membership!");
        }

        // Attiva la membership
        utente.setMembership(true);

        // Controlla se è il primo acquisto e assegna
        // eventualmente i punti di benvenuto
        Integer punti = puntiService.primoAcquisto(utente);

        // Salva le modifiche dell'utente
        repoUtenti.save(utente);

        return ResponseEntity.ok("Membership attivata con successo! Hai ricevuto " + punti + " punti.");
    }
}