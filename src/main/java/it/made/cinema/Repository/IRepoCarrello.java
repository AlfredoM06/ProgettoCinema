package it.made.cinema.Repository;


import it.made.cinema.Model.Carrello;
import it.made.cinema.Model.Utente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface IRepoCarrello extends JpaRepository<Carrello, Integer> {

    public Carrello findByUtente(Utente utente);
}
