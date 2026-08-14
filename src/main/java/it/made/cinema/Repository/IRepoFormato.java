package it.made.cinema.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import it.made.cinema.Model.Formato;

public interface IRepoFormato extends JpaRepository<Formato, Integer>{

}
