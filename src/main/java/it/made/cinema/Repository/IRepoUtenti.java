package it.made.cinema.Repository;

import it.made.cinema.Model.GenereFilm;
import it.made.cinema.Model.Utente;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IRepoUtenti extends JpaRepository<Utente, Integer> {

}
