package it.made.cinema.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import it.made.cinema.Model.Offerta;

public interface IRepoOfferte extends JpaRepository<Offerta, Integer> {

}
