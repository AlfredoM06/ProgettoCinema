package it.made.cinema.Repository;

import it.made.cinema.Model.GenereFilm;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface IRepoGeneri  extends JpaRepository<GenereFilm, Integer> {
    public Optional<GenereFilm> findByGenereFilmContaining(String genereFilm);
}
