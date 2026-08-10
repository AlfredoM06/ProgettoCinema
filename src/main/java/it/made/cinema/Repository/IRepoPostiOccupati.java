package it.made.cinema.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import it.made.cinema.Model.PostiOccupati;
import it.made.cinema.Model.ProgrammazioneFilm;

public interface IRepoPostiOccupati extends JpaRepository<PostiOccupati, Integer>  {

	List<PostiOccupati> findByUtenteId(Integer id);
	/*public void deleteByIdProgrammazioneFilm(Integer id);*/

	void deleteByProgrammazioneFilm(ProgrammazioneFilm p);
}
