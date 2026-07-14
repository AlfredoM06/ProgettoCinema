package it.made.cinema.Controller;

import it.made.cinema.Model.DTO.DatiUtenteDTO;
import it.made.cinema.Model.DTO.PostiOccupatiDTO;
import it.made.cinema.Model.PostiOccupati;
import it.made.cinema.Model.Utente;
import it.made.cinema.Repository.IRepoPostiOccupati;
import it.made.cinema.Repository.IRepoUtenti;
import it.made.cinema.Service.PrezzoService;

import org.springframework.beans.factory.annotation.Autowired;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@Controller
@RequestMapping("/utente")
public class PaginaUtenteController {

    @Autowired
    IRepoUtenti repoUtenti;
    
    @Autowired
    IRepoPostiOccupati repoPO;

    @Autowired
    PrezzoService prezzoService;
    
    @GetMapping
    public String paginaUtente() {
        return "utente-profilo";
    }

    //                  DA FARE:
    //1) I biglietti prenotati e acquistati con i relativi dati i quali verranno cancellati dopo 1 settimana per eventuali rimborsi.
    // va aggiunto attributo in posti occupati che lega utente con posto occupato (tramite id utente) tramite l'id posto occupato andiamo in programmazione e vediamo quale film ha prenotato/acquistato.
    @GetMapping("/acquisti/{id}")
    public @ResponseBody List<PostiOccupatiDTO> bigliettiAcquistati(@PathVariable Integer id){
    	List<PostiOccupati> postiOccupati = repoPO.findByUtenteId(id);
    	List<PostiOccupatiDTO> biglietti = new ArrayList<>();
    	for (PostiOccupati posto:postiOccupati) {
    		biglietti.add(new PostiOccupatiDTO(
    				posto.getId(),
    				posto.getProgrammazioneFilm().getFilm().getTitolo(),
    				posto.getProgrammazioneFilm().getOrario(),
    				posto.getProgrammazioneFilm().getOrario().plusMinutes(posto.getProgrammazioneFilm().getFilm().getDurata()+30),
    				posto.getProgrammazioneFilm().getDataProgrammazione(),
    				posto.getProgrammazioneFilm().getSala().getId(),
    				posto.getPosto().getTipo(),
    				posto.getPosto().getFila(),
    				posto.getPosto().getColonna(),
    				prezzoService.calcolaPrezzoFinale(posto.getUtente(), posto.getProgrammazioneFilm().getFilm(), posto.getPosto())
    				));
    	}
    	return biglietti;
    }

    //4) Relativi gadget o offerte ottenute dall'acquisto di film o utilizzo di offerte.(da fare tabella per legare utente-gadget-dataDiAcquisto)
    //10) Solo per l'anteprima dei film i posti vip saranno riservati ai possessori di carta myUci,
    // se i posti non verranno comprati entro 4 ore prima dell'anteprima verranno sbloccati i posti al pubblico.
    // (Ragionamento da far verificare ad emilio = fare un if per capire se hai la carta o meno, poi far si che solo chi ha la carta può accedere ai posti vip, per gli altri fare un data di inizio minus 4 ore data di inzio)
    // (soluzione emilio la parte di impedire agli altri di prenotare se non hanno la carte da far fare a erica tramite un if che mostra solo a chi è tesserato la possibilità di prendersi quei posti, erica si richiama un metodo che gli facciamo noi
    // in cui calcoliamo se mancano effettivamente 4 ore all'inizio dell'anteprima e vedere se è tesserato o meno)

    //                  FATTI:

    //2) Se ha acquistato una card(ricaricabile) e o abbonamento.
    @GetMapping("/abbonamento/{id}")
    public Boolean abbonamento(@PathVariable Integer id) {
        Optional<Utente> utenteOpt = repoUtenti.findById(id);
        if (utenteOpt.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Utente non trovato");
        }
        Utente utente = utenteOpt.get();
        Boolean statoAbbonamento = utente.getCartaRicaricabile();
        return statoAbbonamento;
    }

    //3) Cambiare i suoi dati tipo l'email.
    @PostMapping("/modifica/{id}")
    @ResponseBody
    public ResponseEntity<String> modificaUtente(
            @PathVariable Integer id,
            @RequestBody DatiUtenteDTO datiModifica) {

        Utente utente = repoUtenti.findById(id).get();

        // Modifica email se presente
        if (datiModifica.getEmail() != null && !datiModifica.getEmail().isBlank()) {
            utente.setEmail(datiModifica.getEmail());
        }

        // Modifica password se presente
        if (datiModifica.getPassword() != null && !datiModifica.getPassword().isBlank()) {
            utente.setPassword(datiModifica.getPassword()); // ← quando avrai Spring Security qui va l'encoder
        }

        repoUtenti.save(utente);
        return ResponseEntity.ok("Dati aggiornati con successo");
    }

    //5) Card myS&G (carta con punti ottenuti).
    @GetMapping("/punti/{id}")
    public Integer puntiMembership(@PathVariable Integer id) {
        Optional<Utente> utenteOpt = repoUtenti.findById(id);
        if (utenteOpt.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Utente non trovato");
        }
        Utente utente = utenteOpt.get();
        Integer nPunti = utente.getPuntiMembership();
        return nPunti;
    }

    //6) Biglietto omaggio per il tuo compleanno da usare entro i 6 giorni successivi alla data di comp.(FATTO DA DOM)
    //7) Prezzo base bliglietto 7 euro, prezzo con card myUCI è 5 euro.(controller membership) (FATTO) metodo non più necessario poichè è stato accorpato al 9 e spostato sul controller del biglietto
    //8) C'è lo sconto al bar del 10% sui gadget relativi ad un film (se hai la card punti,controller membership).(FATTO)
    //9) Film e o menu gratis/scontati a seconda dei punti.(controller membership) spostano in biglietto controller. (FATTO)
    //11) Per determinate cose si hanno dei punti extra (es. chi vede i film sponsorizzati riceveranno punti extra) e per ogni anno di possesso della card si guadagno punti.(FINITO)
    //12) fare metodo per i punti della carta che ad ogni euro speso equivale a 10 punti da collegare all'11.(FINITO)
    // Qunado fai la card myS&G ti danno punti di benvenuto, all'acquisto della card/abbonamento si riceveranno punti da aggiungere alla myS&G;
    // la carta punti e le carte ricaricabili sono due entità separate.
    // Le carte ricariabili saranno ad uso singolo: nel senso che se scade o finisci gli usi limitati, le opzioni sono due:
    // op 1 si rinnova la carta, op 2 si cambia tipo di carta.
    // Se ad esempio passo da basic a plus sarà attiva solo la plus tipo piano di netflix.

}
