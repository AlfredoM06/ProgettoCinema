package it.made.cinema.Service;

import it.made.cinema.Model.Film;
import it.made.cinema.Model.Offerta;
import it.made.cinema.Model.Posto;
import it.made.cinema.Model.Utente;
import org.springframework.stereotype.Service;

import java.time.*;
import java.time.temporal.ChronoUnit;

@Service
public class OrarioService {

    // tipi di dato provvisori in vista della modifica della programmazione e creazione delle anteprime
    public Boolean oreMancanti(LocalDate dataProgrammazione, LocalTime orarioFilm) {

        // Combini data e ora del film in un LocalDateTime
        LocalDateTime inizioFilm = LocalDateTime.of(dataProgrammazione, orarioFilm);

        // Prendi il momento attuale
        LocalDateTime adesso = LocalDateTime.now();

        // Calcoli la differenza in ore tra adesso e l'inizio del film
        long oreMancantiAlFilm = ChronoUnit.HOURS.between(adesso, inizioFilm);

        // Restituisci true se mancano meno di 4 ore
        return oreMancantiAlFilm >= 0  && oreMancantiAlFilm <= 4;

    }

}
