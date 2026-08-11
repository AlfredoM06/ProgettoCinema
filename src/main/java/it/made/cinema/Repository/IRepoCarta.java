package it.made.cinema.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import it.made.cinema.Model.NomeCarta;

public interface IRepoCarta extends JpaRepository<NomeCarta, Integer>{
	
}
