package it.made.cinema.Repository;

import it.made.cinema.Model.Film;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IRepoFilm extends JpaRepository<Film, Integer> {
}
