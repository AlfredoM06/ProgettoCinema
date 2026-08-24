package it.made.cinema.Repository;

import it.made.cinema.Model.CrossFilmFormatoLingua;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IRepoCross extends JpaRepository<CrossFilmFormatoLingua, Integer> {
    List<CrossFilmFormatoLingua> findByFilmId(Integer id);
    void deleteByFilmId(Integer id);
}
