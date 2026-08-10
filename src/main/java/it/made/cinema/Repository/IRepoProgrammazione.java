package it.made.cinema.Repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import it.made.cinema.Model.ProgrammazioneFilm;

public interface IRepoProgrammazione extends JpaRepository<ProgrammazioneFilm, Integer> {
	public List<ProgrammazioneFilm> findByDataProgrammazioneAndFilmId (LocalDate dataProgrammazione, Integer id);
	public List<ProgrammazioneFilm> findByDataProgrammazioneGreaterThanEqualAndFilmId(LocalDate dataProgrammazione, Integer id);
	public List<ProgrammazioneFilm> findByDataProgrammazione(LocalDate dataProgrammazione);
	public List<ProgrammazioneFilm> findByDataProgrammazioneAndFilmIdAndSalaId(LocalDate dataProgrammazione, Integer idFilm, Integer idSala);
	public List<ProgrammazioneFilm> findByDataProgrammazioneAndSalaId(LocalDate dataProgrammazione, Integer idSala);
}
