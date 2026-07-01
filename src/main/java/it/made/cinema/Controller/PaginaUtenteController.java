package it.made.cinema.Controller;

import it.made.cinema.Model.Film;
import it.made.cinema.Model.Utente;
import it.made.cinema.Repository.IRepoFilm;
import it.made.cinema.Repository.IRepoOfferte;
import it.made.cinema.Repository.IRepoUtenti;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;
import org.springframework.web.server.ResponseStatusException;

import it.made.cinema.Model.Utente;
import it.made.cinema.Repository.IRepoUtenti;

@Controller
@RequestMapping("/utente")
public class PaginaUtenteController {
    @Autowired
    IRepoFilm repoFilm;
    @Autowired
    IRepoOfferte repoOfferte;
    @Autowired
    IRepoUtenti repoUtenti;


    //                  DA FARE:
	//1) I biglietti prenotati e acquistati con i relativi dati i quali verranno cancellati dopo 1 settimana per eventuali rimborsi. (da fare probabilmente un model e una tabella per salvare i biglietti)
    //2) Se ha acquistato una card(ricaricabile) e o abbonamento.
	@GetMapping("/abbonamento/{id}")
	public Boolean abbonamento(@PathVariable Integer id){
		Optional<Utente> utenteOpt= repoUtenti.findById(id);
		if(utenteOpt.isEmpty()) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Utente non trovato");
		}
		Utente utente = utenteOpt.get();
		Boolean statoAbbonamento = utente.getCartaRicaricabile();
		return statoAbbonamento;
	}
    //3) Cambiare i suoi dati tipo l'email.
    //4) Relativi gadget o offerte ottenute dall'acquisto di film o utilizzo di offerte.
    //5) Card myS&G (carta con punti ottunuti).
    //6) Biglietto omaggio per il tuo compleanno da usare entro i 6 giorni successivi alla data di comp.(controller membership)
    //7) Prezzo base bliglietto 7 euro, prezzo con card myUCI è 5 euro.(controller membership)
        @GetMapping("/prezzoBiglietto/{id}")
        public Double prezzoBiglietto(@PathVariable("id") Integer id) {

            Film film = repoFilm.findById(id).get();
            Utente utente = repoUtenti.findById(id).get();

            Double prezzo;
            if (Boolean.TRUE.equals(utente.getMembership())) {
                prezzo = 5.0;
            } else {
                prezzo = film.getPrezzo();
            }

            return prezzo;
        }
    //8) C'è lo sconto al bar del 10% sui gadget relativi ad un film (se hai la card punti,controller membership).
    //9) Film e o menu gratis/scontati a seconda dei punti.(controller membership)
    //10) Solo per l'anteprima dei film i posti vip saranno riservati ai possessori di carta myUci,
    // se i posti non verranno comprati entro 4 ore prima dell'anteprima verranno sbloccati i posti al pubblico.(controller membership)
    //11) Per determinate cose si hanno dei punti extra (es. chi vede i film sponsorizzati riceveranno punti extra) e per ogni anno di possesso della card si guadagno punti.



    //Le card se le accolla alfredo e ci deve stare
    //fare metodi direttamente qui per le card sia punti quindi membership sia ricaricabili.
    // P.S. Qunado fai la card myS&G ti danno punti di benvenuto, all'acquisto della card/abbonamento si riceveranno punti da aggiungere alla myS&G;
    // la carta punti e le carte ricaricabili sono due entità separate.
    // Le carte ricariabili saranno ad uso singolo: nel senso che se scade o finisci gli usi limitati, le opzioni sono due:
    // op 1 si rinnova la carta, op 2 si cambia tipo di carta.
    // Se ad esempio passo da basic a plus sarà attiva solo la plus tipo piano di netflix.

}
