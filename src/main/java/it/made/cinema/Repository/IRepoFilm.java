package it.made.cinema.Repository;

import it.made.cinema.Model.Film;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Date;
import java.util.List;

public interface IRepoFilm extends JpaRepository<Film, Integer> {

    @Query(value = "select f.* from db_cinema.films f, db_cinema.programmazione_dei_film pf where f.data_di_uscita > CURRENT_DATE() and pf.id_film = f.id order by pf.n_prenotazioni desc limit 5", nativeQuery = true)
    public List<Film> findByAllDate();//rimosso n prenotazioni da vedere se funziona altrimenti va reinserito e va controllato cosa sono i service
    public List<Film> findByTitoloContainingOrRegistaContainingOrCastContainingOrDistribuzioneContaining(String titolo, String regista, String cast, String distribuzione);
    public List<Film> findByArchiviatoFalse();
    //public List<Film> findByGeneriId(Integer id);
    @Query("select distinct f from Film f join fetch f.generi g where g.id in :idGenere")
    public List<Film> findByGenereFilm(@Param("idGenere") List<Integer> idGenere);
    // 7 film con data di uscita più recente
    List<Film> findTop7ByOrderByDataDiUscitaDesc();
    //mettere query per fare la ricerca dei film in evidenza contando quanti posti sono stati occupati che equivalgono ai biglietti comprati
    @Query(value = "SELECT f.*, COUNT(po.id) AS posti_occupati FROM posti_occupati po, programmazione_dei_film pdf, films f WHERE pdf.id_film = f.id AND po.id_programmazione_film = pdf.id GROUP BY f.id ORDER BY posti_occupati DESC LIMIT 6", nativeQuery = true)
    public List<Film> findFilmEvidenza();
}
