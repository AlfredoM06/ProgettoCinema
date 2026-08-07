package it.made.cinema.Repository;


import it.made.cinema.Model.Carello;
import it.made.cinema.Model.Utente;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IRepoCarello extends JpaRepository<Carello, Integer> {

    public Carello findaByUtente(Utente utente);
}
