package it.made.cinema.Controller;

import it.made.cinema.Model.*;
import it.made.cinema.Model.DTO.*;
import it.made.cinema.Repository.IRepoFilm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.ArrayList;
import java.util.List;

@Controller
@RequestMapping("/")
public class HomeController {
    @Autowired
    IRepoFilm repoFilm;

    //log in da fare
    // bisogna fare un filtro per visualizzare i film in evidenza da decidere che attributo assegnargli soluzione = fare in base ai biglietti aquistati come non lo so e non lo voglio sapere
    // e nel carousel grande da filtrare negli ultimi 7 appena usciti.

    //lista dei film, lista offerte , lista film in Evidenza  da finire
    @GetMapping
    public String home(Model model) {
        List<Film> filmRecenti = repoFilm.findTop7ByArchiviatoFalseOrderByDataDiUscitaDesc();
        List<ListaFilmRecentiDTO> filmRecentiDTO = new ArrayList<>();
        for (Film recente : filmRecenti) {
            ListaFilmRecentiDTO listaRecenti = new ListaFilmRecentiDTO();
            listaRecenti.setId(recente.getId());
            listaRecenti.setDescrizione(recente.getDescrizione());
            listaRecenti.setDurata(recente.getDurata());
            listaRecenti.setTitolo(recente.getTitolo());
            listaRecenti.setImg_cover(recente.getImg_cover());
            listaRecenti.setImg_logo(recente.getImg_logo());
            listaRecenti.setDataDiUscita(recente.getDataDiUscita());
            listaRecenti.setImg_poster(recente.getImg_poster());
            List<ListaGenereDTO> listaGenere = new ArrayList<>();
            for (GenereFilm g : recente.getGeneri()) {
                ListaGenereDTO listaGenDTO = new ListaGenereDTO();
                listaGenDTO.setId(g.getId());
                listaGenDTO.setNome(g.getNome());
                listaGenere.add(listaGenDTO);
            }
            listaRecenti.setGeneri(listaGenere);
            filmRecentiDTO.add(listaRecenti);
        }

        List<Film> filmInEvidenza = repoFilm.findFilmEvidenza();
        List<ListaFilmRecentiDTO> evidenzaDTO = new ArrayList<>();

        for (Film evidenza : filmInEvidenza){
            ListaFilmRecentiDTO listaEvidenza = new ListaFilmRecentiDTO();
            listaEvidenza.setId(evidenza.getId());
            listaEvidenza.setDurata(evidenza.getDurata());
            listaEvidenza.setTitolo(evidenza.getTitolo());
            listaEvidenza.setDataDiUscita(evidenza.getDataDiUscita());
            listaEvidenza.setImg_poster(evidenza.getImg_poster());
            List<ListaGenereDTO> listaGenere = new ArrayList<>();
            for (GenereFilm g : evidenza.getGeneri()) {
                ListaGenereDTO listaGenDTO = new ListaGenereDTO();
                listaGenDTO.setId(g.getId());
                listaGenDTO.setNome(g.getNome());
                listaGenere.add(listaGenDTO);
            }
            listaEvidenza.setGeneri(listaGenere);
            List<String> formati = new ArrayList<>();
            for (CrossFilmFormatoLingua cross : evidenza.getCrossFilmFormatoLingua()){
                if (!formati.contains(cross.getFormato().getNome())){
                    formati.add(cross.getFormato().getNome());
                }
            }
            listaEvidenza.setFormato(formati);
            evidenzaDTO.add(listaEvidenza);
        }

        model.addAttribute("inEvidenza", filmInEvidenza);
        model.addAttribute("filmRecenti", filmRecentiDTO);

        return "Home";
    }
}
