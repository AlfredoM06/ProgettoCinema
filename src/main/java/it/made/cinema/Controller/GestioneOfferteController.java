package it.made.cinema.Controller;

import it.made.cinema.Model.DTO.GestioneOfferteDTO;
import it.made.cinema.Model.DTO.OfferteDTO;
import it.made.cinema.Model.Film;
import it.made.cinema.Model.Offerta;
import it.made.cinema.Repository.IRepoFilm;
import it.made.cinema.Repository.IRepoOfferte;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/admin/gestioneOfferte")
public class GestioneOfferteController {

    @Autowired
    IRepoOfferte repoOfferte;
    @Autowired
    IRepoFilm repoFilm;

    @GetMapping("/listaOfferte")
    @ResponseBody
    public List<Map<String, Object>> listaOfferte(){
        List<Offerta> offerte = repoOfferte.findAll();
        List<Map<String, Object>> listeOfferte = new ArrayList<>();
        for (Offerta o : offerte){
            Map<String, Object> mapOfferta = new HashMap<>();
            mapOfferta.put("id", o.getId());
            mapOfferta.put("nome", o.getNome());
            mapOfferta.put("categoria", o.getGenere());
            mapOfferta.put("dataInizio", o.getDataInizio());
            mapOfferta.put("dataFine", o.getDataScadenza());
            listeOfferte.add(mapOfferta);
        }
        return listeOfferte;
    }

    @PostMapping("/salvaOfferta")
    @ResponseBody
    public Boolean salvaOfferta(@RequestBody GestioneOfferteDTO offerteDTO){
        Offerta offerta = new Offerta();
        offerta.setId(offerteDTO.getId());
        offerta.setNome(offerteDTO.getNome());
        offerta.setGenere(offerteDTO.getGenere());
        offerta.setDescrizione(offerteDTO.getDescrizione());
        offerta.setPrezzo(offerteDTO.getPrezzo());
        offerta.setDataInizio(offerteDTO.getDataInizio());
        offerta.setDataScadenza(offerteDTO.getDataScadenza());
        offerta.setImgBanner(offerteDTO.getImgBanner());
        offerta.setImgDettaglio(offerteDTO.getImgDettaglio());
        offerta.setImgBannerTopOfferte(offerteDTO.getImgBannerTopOfferte());
        if (!(offerteDTO.getIdFilm() == null)){
            Film film = repoFilm.findById(offerteDTO.getIdFilm()).get();
            offerta.setFilm(film);
        }
        repoOfferte.save(offerta);
        return true;
    }

    @GetMapping("/getOfferta/{id}")
    @ResponseBody
    public GestioneOfferteDTO getOfferta (@PathVariable (name = "id") Integer id){
        Offerta offerta = repoOfferte.findById(id).get();
        GestioneOfferteDTO dto = new GestioneOfferteDTO();
        dto.setId(offerta.getId());
        dto.setNome(offerta.getNome());
        dto.setGenere(offerta.getGenere());
        dto.setDescrizione(offerta.getDescrizione());
        dto.setPrezzo(offerta.getPrezzo());
        dto.setDataInizio(offerta.getDataInizio());
        dto.setDataScadenza(offerta.getDataScadenza());
        dto.setImgBanner(offerta.getImgBanner());
        dto.setImgDettaglio(offerta.getImgDettaglio());
        dto.setImgBannerTopOfferte(offerta.getImgBannerTopOfferte());
        if (offerta.getFilm() != null){
            dto.setIdFilm(offerta.getFilm().getId());
        }
        return dto;
    }

    @PostMapping("/cancellaOfferta/{id}")
    @ResponseBody
    public Boolean cancella(@PathVariable("id") Integer id) {
        repoOfferte.deleteById(id);
        return true;
    }
}