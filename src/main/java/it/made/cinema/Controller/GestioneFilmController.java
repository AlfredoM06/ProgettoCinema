package it.made.cinema.Controller;

import it.made.cinema.Model.CrossFilmFormatoLingua;
import it.made.cinema.Model.Film;
import it.made.cinema.Model.Formato;
import it.made.cinema.Model.GenereFilm;
import it.made.cinema.Model.Lingua;
import it.made.cinema.Model.Partnership;
import it.made.cinema.Model.DTO.FormFilmDTO;
import it.made.cinema.Repository.IRepoFilm;
import it.made.cinema.Repository.IRepoGeneri;
import it.made.cinema.Repository.IRepoPartnership;
import jakarta.validation.Valid;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping("/admin/gestioneFilm")
public class GestioneFilmController {

    //c'è la pagina
    // gestione drop down con utenti, film e profilo, login e archivio (da vedere come fare)

    @Autowired
    IRepoFilm repoFilm;

    @Autowired
    IRepoGeneri repoGeneri;

    @Autowired
    IRepoPartnership repoPartner;
    //Film film;

    //form
    //da fare validazioni form
    @GetMapping("/salvaFilm")
    public @ResponseBody Boolean salvaFilm(@RequestBody FormFilmDTO dto) {
        Film film = new Film();
        film.setId(dto.getId());
        film.setTitolo(dto.getTitolo());
        film.setDistribuzione(dto.getDistribuzione());
        film.setDescrizione(dto.getSinossi());
        List<GenereFilm> generi = new ArrayList<>();
        for (Integer g : dto.getGenere()) {
            generi.add(repoGeneri.findById(g).get());
        }
        film.setGeneri(generi);
        film.setDataDiUscita(dto.getDataUscita());
        film.setDurata(dto.getDurata());
        film.setPrezzo(dto.getPrezzo());
        Lingua italiano = new Lingua(); // potrebbe rompersi, spostare dopo il salvataggio in caso
        italiano.setId(1);
        Lingua inglese = new Lingua();
        inglese.setId(2);
        List<CrossFilmFormatoLingua> cross = new ArrayList<>();
        for (Integer f : dto.getItaliano()) {
            Formato formato = new Formato();
            formato.setId(f);
            CrossFilmFormatoLingua c = new CrossFilmFormatoLingua();
            c.setFormato(formato);
            c.setLingua(italiano);
            c.setFilm(film);
            cross.add(c);
        }
        for (Integer f : dto.getInglese()) {
            Formato formato = new Formato();
            formato.setId(f);
            CrossFilmFormatoLingua c = new CrossFilmFormatoLingua();
            c.setFormato(formato);
            c.setLingua(inglese);
            c.setFilm(film);
            cross.add(c);
        }
        film.setCrossFilmFormatoLingua(cross);
        film.setImg_cover(dto.getImgCopertina());
        film.setImg_poster(dto.getImgLocandina());
        film.setImg_logo(dto.getImgLogo());
        if (dto.getPartnership()) {
            Partnership partner = new Partnership();
            partner.setImg_banner(dto.getImgPartnership());
            partner.setNome(dto.getTitolo());
            film.setPartnership(partner);
        }
        film.setArchiviato(dto.getArchiviato());
        repoFilm.save(film);
        return true;
    }


    @GetMapping("/listaArchivio")
    public @ResponseBody Map<?, ?> listaArchivio(Boolean archiviato) {
        List<Film> lista = repoFilm.findByArchiviato(archiviato);
        Map<String, Object> films = new HashMap<String, Object>();
        for (Film f : lista) {
            films.put("id", f.getId());
            films.put("titolo", f.getTitolo());
            films.put("distribuzione", f.getDistribuzione());
            films.put("dataUscita", f.getDataDiUscita());
        }
        return films;
    }

    @PostMapping("/cancellaFilm/{id}")
    public @ResponseBody Boolean cancella(@PathVariable("id") Integer id) {
        repoFilm.deleteById(id);
        return true;
    }

    @PostMapping("/archivia/{id}")
    public @ResponseBody Boolean archivia(@PathVariable("id") Integer id) {
        Film film = repoFilm.findById(id).get();
        film.setArchiviato(!film.getArchiviato());
        repoFilm.save(film);
        return true;
    }

    @PostMapping("/cancellaPartnership/{id}")
    public @ResponseBody Boolean cancellaPartnership(@PathVariable("id") Integer id) {
        Partnership partner = repoPartner.findByFilmId(id);
        repoPartner.deleteById(partner.getId());
        return true;
    }


}
