package it.made.cinema.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import it.made.cinema.Model.Offerta;

import java.util.List;

public interface IRepoOfferte extends JpaRepository<Offerta, Integer> {
    public List<Offerta> findByGenere(String genere);
    public List<Offerta> findTop3ByOrderByDataInizioDesc();

}
