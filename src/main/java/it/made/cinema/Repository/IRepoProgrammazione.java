package it.made.cinema.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import it.made.cinema.Model.ProgrammazioneFilm;

public interface IRepoProgrammazione extends JpaRepository<ProgrammazioneFilm, Integer> {

}
