package it.made.cinema.Service;

import it.made.cinema.Model.NomeCarta;
import it.made.cinema.Model.Sala;
import it.made.cinema.Model.Utente;
import it.made.cinema.Repository.IRepoUtenti;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class CartaPrepagataService {

    public Boolean validitaCarta(Utente utente, Sala sala, Integer tipoPosto) {

        // Se non ha la carta ricaricabile → non valida
        if (!Boolean.TRUE.equals(utente.getCartaRicaricabile())) {
            return false;
        }

        // Carta annuale (id 3) → controlla solo la scadenza, utilizzi illimitati
        if (utente.getNomeCarta().getId().equals(3)) {
            return utente.getDataScadenza() != null &&
                    utente.getDataScadenza().isAfter(LocalDate.now());
        }

        // Carta Basic (id 1) e Plus (id 2) → controlla utilizzi rimasti
        if (utente.getUtilizziCard() == null || utente.getUtilizziCard() <= 0) {
            return false;
        }

        switch (utente.getNomeCarta().getId()) {
            case 1: // Basic → solo sala standard (id 1) e non VIP (tipo 2)
                return sala.getId().equals(1) && tipoPosto != 2;
            case 2: // Plus → tutte le sale tranne IMAX (id 3) e non VIP
                return !sala.getId().equals(3) && tipoPosto != 2;
            default:
                return false;
        }
    }
}