package it.made.cinema.Repository;

import it.made.cinema.Model.CrossFilmFormatoLingua;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IRepoCross extends JpaRepository<CrossFilmFormatoLingua, Integer> {
}
