package it.made.cinema.Repository;

import it.made.cinema.Model.Partnership;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IRepoPartnership extends JpaRepository<Partnership, Integer> {
}
