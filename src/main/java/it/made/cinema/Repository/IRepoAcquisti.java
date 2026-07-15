package it.made.cinema.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import it.made.cinema.Model.AcquistiGadget;

public interface IRepoAcquisti extends JpaRepository<AcquistiGadget, Integer>{
	List<AcquistiGadget> findByUtenteIdAndOffertaGenere(Integer id, String genere);
	
	List<AcquistiGadget> findByUtenteId(Integer id);
}
