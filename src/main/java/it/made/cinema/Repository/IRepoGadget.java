package it.made.cinema.Repository;

import it.made.cinema.Model.Gadget;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IRepoGadget extends JpaRepository<Gadget, Integer> {
}
