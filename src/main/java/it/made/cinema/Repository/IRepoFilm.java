package it.made.cinema.Repository;

import it.made.cinema.Model.Film;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface IRepoFilm extends JpaRepository<Film, Integer> {

    @Query(value = "select  f.* from  db_cinema.films f,  (  select  pdf.id_film , SUM( pdf.n_prenotazioni ) prenotazioni from  db_cinema.programmazione_dei_film pdf, db_cinema.films f where f.id = pdf.id_film AND f.data_di_uscita > CURRENT_DATE() AND f.archiviato <> 1 group by pdf.id_film order by prenotazioni desc limit 5 ) t1 where  f.id = t1.id_film ;", nativeQuery = true)
    public List<Film> findByAllDate();//rimosso n prenotazioni da vedere se funziona altrimenti va reinserito e va controllato cosa sono i service
    public List<Film> findByTitoloContainingOrRegistaContainingOrCastContainingOrDistribuzioneContaining(String titolo, String regista, String cast, String distribuzione);
    public List<Film> findByArchiviatoFalse();
    //public List<Film> findByGeneriId(Integer id);
    @Query("select distinct f from Film f join fetch f.generi g where g.id in :idGenere")
    public List<Film> findByGenereFilm(@Param("idGenere") List<Integer> idGenere);
    // 7 film con data di uscita più recente
    List<Film> findTop7ByArchiviatoFalseOrderByDataDiUscitaDesc();
    //mettere query per fare la ricerca dei film in evidenza contando quanti posti sono stati occupati che equivalgono ai biglietti comprati
    @Query(value = "SELECT f.*, COUNT(po.id) AS posti_occupati FROM posti_occupati po, programmazione_dei_film pdf, films f WHERE pdf.id_film = f.id AND po.id_programmazione_film = pdf.id GROUP BY f.id ORDER BY posti_occupati DESC LIMIT 6", nativeQuery = true)
    public List<Film> findFilmEvidenza();
	public List<Film> findByArchiviato(Boolean archiviato);
}