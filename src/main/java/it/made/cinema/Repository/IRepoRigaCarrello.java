package it.made.cinema.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import it.made.cinema.Model.RigaCarrello;

public interface IRepoRigaCarrello extends JpaRepository<RigaCarrello, Integer> {
    Optional<RigaCarrello> findByCarrelloIdAndOffertaId(Integer idCarrello, Integer idOfferta);
}