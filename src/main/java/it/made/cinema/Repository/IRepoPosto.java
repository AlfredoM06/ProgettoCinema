package it.made.cinema.Repository;


import it.made.cinema.Model.Posto;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IRepoPosto extends JpaRepository<Posto, Integer> {
}
