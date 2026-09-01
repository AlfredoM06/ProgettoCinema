package it.made.cinema.Service;

import it.made.cinema.Model.Film;
import it.made.cinema.Model.Posto;
import it.made.cinema.Model.Utente;
import it.made.cinema.Repository.IRepoUtenti;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class PuntiService {

    @Autowired
    IRepoUtenti repoUtenti;

    //11) Per determinate cose si hanno dei punti extra (es. chi vede i film sponsorizzati riceveranno punti extra) e per ogni anno di possesso della card si guadagno punti.(PARZIALMENTE FINITO DA FINIRE CON IL 12)
    //12) fare metodo per i punti della carta che ad ogni euro speso equivale a 10 punti da collegare all'11.(da fare il service)
    // Qunado fai la card myS&G ti danno punti di benvenuto, all'acquisto della card/abbonamento si riceveranno punti da aggiungere alla myS&G;

    // se ho speso 20 euro per un film = 20 * 10 = 200 punti vanno messi sulla myCard dell'utente
    // se il film è sponsorizzato i punti sono doppi
    // il film è sponsorizzato se esiste una partnership con l'id film (ovvero fare una select)
    public Integer puntiBiglietto(Double prezzoFinale, Boolean partnership){
        Integer punti;
        if (partnership.equals(Boolean.TRUE)){
            punti = (int) (prezzoFinale * 10) * 2;
        } else {
            punti = (int) (prezzoFinale * 10);
        }
        return  punti;
    }

    //punti per acquisti carrello
    public Integer puntiAcquisto(Double prezzoFinale){
        Integer punti;
        punti = (int)(prezzoFinale * 10);
        return punti;
    }

    // acquisto membership
    public Integer primoAcquisto(Utente utente){
        Integer punti = utente.getPuntiMembership();

        if (utente.getAcquistoMembership() == null){
            utente.setAcquistoMembership(LocalDate.now());
        }

        if (punti.equals(0)){
            utente.setPuntiMembership(punti + 20);
        }

        return punti;
    }

}
