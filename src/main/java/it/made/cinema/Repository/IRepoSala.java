package it.made.cinema.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import it.made.cinema.Model.Sala;

public interface IRepoSala extends JpaRepository<Sala, Integer>{
	
	public Sala findPostiById(Integer id);
}
