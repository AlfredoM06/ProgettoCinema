package it.made.cinema.Repository;

import java.time.LocalDate;
import java.util.List;

import it.made.cinema.Model.DTO.ArchivioProgrammazioniDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.jpa.repository.JpaRepository;

import it.made.cinema.Model.ProgrammazioneFilm;
import org.springframework.data.jpa.repository.Query;

public interface IRepoProgrammazione extends JpaRepository<ProgrammazioneFilm, Integer> {
	public List<ProgrammazioneFilm> findByDataProgrammazioneAndFilmId (LocalDate dataProgrammazione, Integer id);
	public List<ProgrammazioneFilm> findByDataProgrammazioneGreaterThanEqualAndFilmId(LocalDate dataProgrammazione, Integer id);
	public List<ProgrammazioneFilm> findByDataProgrammazione(LocalDate dataProgrammazione);
	public List<ProgrammazioneFilm> findByDataProgrammazioneAndFilmIdAndSalaId(LocalDate dataProgrammazione, Integer idFilm, Integer idSala);
	public List<ProgrammazioneFilm> findByDataProgrammazioneAndSalaId(LocalDate dataProgrammazione, Integer idSala);

	@Query(value = "select new it.made.cinema.Model.DTO.ArchivioProgrammazioniDTO(p.film.id, p.sala.id, p.film.titolo, concat('sala ', p.sala.id), p.dataProgrammazione) from ProgrammazioneFilm p group by p.film.id, p.sala.id, p.film.titolo, p.dataProgrammazione")
	public List<ArchivioProgrammazioniDTO> findAllGroupByDataProgrammazione();
}
