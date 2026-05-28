package it.made.cinema.Repository;

import it.made.cinema.Model.Film;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Date;
import java.util.List;

public interface IRepoFilm extends JpaRepository<Film, Integer> {

    @Query(value = "select f.data_di_uscita, pf.n_prenotazioni from db_cinema.films f, db_cinema.programmazione_dei_film pf where f.data_di_uscita > CURRENT_DATE() and pf.id_film = f.id order by pf.n_prenotazioni desc limit 5", nativeQuery = true)
    public List<Film> findByAllDate();

}
