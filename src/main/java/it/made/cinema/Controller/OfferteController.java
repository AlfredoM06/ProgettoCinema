package it.made.cinema.Controller;

import java.util.ArrayList;
import java.util.List;

import it.made.cinema.Model.DTO.ListaTop3DTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import it.made.cinema.Model.Offerta;
import it.made.cinema.Model.DTO.ListaOffertaDTO;
import it.made.cinema.Repository.IRepoOfferte;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping("/offerte")
public class OfferteController {

    @Autowired
    private IRepoOfferte repoOfferte;

    //popolare tabella offerte
    //creare repository offerte e scommentare metodo findall
    @GetMapping
    private String offerte(Model model) {
        List<Offerta> offerte = repoOfferte.findAll();
        model.addAttribute("offerte", offerte);
        return "offerte";
    }

    @GetMapping("/filtro")
    public @ResponseBody List<ListaOffertaDTO> filtroOfferte(@RequestParam(name = "filtroOfferta", required = false) String searchOfferta) {
        List<Offerta> offerte = null;
        if (searchOfferta != null && !searchOfferta.isBlank()) {
            offerte = repoOfferte.findByGenere(searchOfferta);
        } else {
            offerte = repoOfferte.findAll();
        }
        List<ListaOffertaDTO> offerteDTO = new ArrayList<ListaOffertaDTO>();
        for (Offerta offerta : offerte) {
            offerteDTO.add(new ListaOffertaDTO(offerta.getId(), offerta.getNome(), offerta.getGenere(), offerta.getDescrizione(), offerta.getImgBanner()));
        }
        return offerteDTO;
    }

    @GetMapping("/top3")
    public @ResponseBody List<ListaTop3DTO> top3Offerte() {
        List<Offerta> offerte = null;
        offerte = repoOfferte.findTop3ByOrderByGenereAsc();
        List<ListaTop3DTO> top3Dto = new ArrayList<ListaTop3DTO>();
        for (Offerta offerta : offerte) {
            top3Dto.add(new ListaTop3DTO(offerta.getId(), offerta.getNome(), offerta.getDataInizio(), offerta.getImgBanner()));
        }
        return top3Dto;
    }

    @GetMapping("/dettagli/{id}")
    public String dettOfferta(@PathVariable("id") Integer id, Model model) {
        model.addAttribute("offerta", repoOfferte.findById(id).get());
        return "offertaDettaglio";
    }
}
