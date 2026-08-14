package it.made.cinema.Controller;

import it.made.cinema.Model.CrossFilmFormatoLingua;
import it.made.cinema.Model.Film;
import it.made.cinema.Model.Formato;
import it.made.cinema.Model.GenereFilm;
import it.made.cinema.Model.Lingua;
import it.made.cinema.Model.Partnership;
import it.made.cinema.Model.DTO.FormFilmDTO;
import it.made.cinema.Repository.IRepoFilm;
import it.made.cinema.Repository.IRepoFormato;
import it.made.cinema.Repository.IRepoGeneri;
import it.made.cinema.Repository.IRepoPartnership;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping("/admin/gestioneFilm")
public class GestioneFilmController {

    @Autowired
    IRepoFilm repoFilm;

    @Autowired
    IRepoGeneri repoGeneri;

    @Autowired
    IRepoPartnership repoPartner;
    //Film film;
    @Autowired
    IRepoFormato repoFormato;

    @PostMapping("/salvaFilm")
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


    @GetMapping("/listaArchivio/{archiviato}")
    public @ResponseBody List<Map<String, Object>> listaArchivio(@PathVariable Boolean archiviato) {
        List<Film> lista = repoFilm.findByArchiviato(archiviato);
        List<Map<String, Object>> films = new ArrayList<>();
        for (Film f : lista) {
            Map<String, Object> mapFilm = new HashMap<>();
            mapFilm.put("id", f.getId());
            mapFilm.put("titolo", f.getTitolo());
            mapFilm.put("distribuzione", f.getDistribuzione());
            mapFilm.put("dataUscita", f.getDataDiUscita());
            films.add(mapFilm);
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

    @GetMapping("/listaGeneri")
    public @ResponseBody Map<Integer, String> getGeneri() {
        List<GenereFilm> lista = repoGeneri.findAll();
        Map<Integer, String> generi = new HashMap<Integer, String>();
        for (GenereFilm g : lista) {
            generi.put(g.getId(), g.getNome());
        }
        return generi;
    }

    @GetMapping("/listaFormati")
    public @ResponseBody Map<Integer, String> getFormato() {
        List<Formato> lista = repoFormato.findAll();
        Map<Integer, String> formati = new HashMap<Integer, String>();
        for (Formato f : lista) {
            formati.put(f.getId(), f.getNome());
        }
        return formati;
    }

    @GetMapping("/film/{id}")
    public @ResponseBody FormFilmDTO getFilm(@PathVariable Integer id) {
        Film film = repoFilm.findById(id).get();
        FormFilmDTO dto = new FormFilmDTO();
        dto.setId(film.getId());
        dto.setTitolo(film.getTitolo());
        dto.setDistribuzione(film.getDistribuzione());
        dto.setSinossi(film.getDescrizione());
        List<Integer> generi = new ArrayList<Integer>();
        for (GenereFilm g : film.getGeneri()) {
            generi.add(g.getId());
        }
        dto.setGenere(generi);
        dto.setDataUscita(film.getDataDiUscita());
        dto.setDurata(film.getDurata());
        dto.setPrezzo(film.getPrezzo());
        List<Integer> italiano = new ArrayList<Integer>();
        List<Integer> inglese = new ArrayList<Integer>();
        for (CrossFilmFormatoLingua c : film.getCrossFilmFormatoLingua()) {
            if (c.getLingua().getNome().equals("italiano")) {
                italiano.add(c.getFormato().getId());
            } else if (c.getLingua().getNome().equals("inglese")) {
                inglese.add(c.getFormato().getId());
            }
        }
        dto.setItaliano(italiano);
        dto.setInglese(inglese);
        dto.setImgCopertina(film.getImg_cover());
        dto.setImgLocandina(film.getImg_poster());
        dto.setImgLogo(film.getImg_logo());
        if (film.getPartnership() != null) {
            dto.setPartnership(true);
            dto.setImgPartnership(film.getPartnership().getImg_banner());
        } else {
            dto.setPartnership(false);
        }
        dto.setArchiviato(film.getArchiviato());
        return dto;
    }
}
