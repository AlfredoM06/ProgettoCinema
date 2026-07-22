package it.made.cinema.Service;

import it.made.cinema.Model.Film;
import it.made.cinema.Model.Offerta;
import it.made.cinema.Model.Posto;
import it.made.cinema.Model.Utente;
import org.springframework.stereotype.Service;

@Service
public class PrezzoService {

        // service per fare il calcolo del prezzo del biglietto (il service serve come layer di mezzo tra controller e repository, gli si passasno i dati e i calcoli da fare e poi lo si richiama nel controller dove serve al contrario di un controller che non può essere richiamato da un'altro controller)
        public Double calcolaPrezzoFinale(Utente utente, Film film, Integer tipo) {

            // Prezzo base del film
            Double prezzoBase = film.getPrezzo();

            // Prezzo del posto in base al tipo
            Double prezzoPosto;
            switch (tipo) {
                case 2 -> prezzoPosto = 9.5;
                case 3 -> prezzoPosto = 5.0;
                default -> prezzoPosto = 7.0; // normale
            }

            // Prezzo totale prima degli sconti
            Double prezzoTotale = prezzoBase + prezzoPosto;

            // Sconto membership
            if (utente.getPuntiMembership() >= 400) {
                return 0.0 + prezzoPosto;
            } else if (Boolean.TRUE.equals(utente.getMembership())) {
                return 5.0 + prezzoPosto; // sconto solo sul film
            }

            return prezzoTotale;
        }

        //8) C'è lo sconto al bar del 10% sui gadget relativi ad un film (se hai la card punti,controller membership).
        public Double calcolaScontoOfferta(Utente utente, Offerta offerta){
            Double prezzoOfferta;
            if (Boolean.TRUE.equals(utente.getMembership())){
                // Sconto del 10% sul prezzo dell'offerta
                // Alternativa più concisa: offerta.getPrezzo() * 0.90
                prezzoOfferta = offerta.getPrezzo() - (offerta.getPrezzo() * 10 / 100);
            } else {
                prezzoOfferta = offerta.getPrezzo();
            }
            return prezzoOfferta;
        }

        /*public  Double calcolaPrezzoFilm(Film film, Utente utente){
            Double prezzoFilm = film.getPrezzo();
            if (utente.getPuntiMembership() >= 400){
                prezzoFilm = 0.0;
                return prezzoFilm;
            } else if (Boolean.TRUE.equals(utente.getMembership())) {
                prezzoFilm = 5.0;
                return prezzoFilm;
            }

            return prezzoFilm;
        }*/


}
