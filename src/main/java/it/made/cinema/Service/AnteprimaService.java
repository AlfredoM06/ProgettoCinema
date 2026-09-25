package it.made.cinema.Service;

import it.made.cinema.Model.ProgrammazioneFilm;
import it.made.cinema.Model.Utente;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AnteprimaService {

    /**
     * Determina se un utente può accedere alla prenotazione di un'anteprima.
     * Regola: consentito se l'utente ha la membership, oppure se sono già
     * passate almeno 5 ore dall'inizio della programmazione dell'anteprima.
     */
    public boolean puoAccedere(Utente utente, ProgrammazioneFilm programmazione) {
        if (Boolean.TRUE.equals(utente.getMembership())) {
            return true;
        }

        LocalDateTime inizioAnteprima = LocalDateTime.of(
                programmazione.getDataProgrammazione(),
                programmazione.getOrario()
        );
        LocalDateTime sogliaAccesso = inizioAnteprima.plusHours(5);

        return LocalDateTime.now().isAfter(sogliaAccesso);
    }
}
