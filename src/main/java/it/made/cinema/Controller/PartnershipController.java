package it.made.cinema.Controller;

import it.made.cinema.Model.Offerta;
import it.made.cinema.Model.Partnership;
import it.made.cinema.Repository.IRepoPartnership;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/partnership")
public class PartnershipController {

    @Autowired
    IRepoPartnership repoPartnership;

    @GetMapping("/listaBanner")
    @ResponseBody
    public List<Map<String, Object>> listaBanner() {
        List<Partnership> banner = repoPartnership.findAll();
        List<Map<String, Object>> listaBanner = new ArrayList<>();
        for (Partnership p : banner){
            Map<String, Object> mapBanner = new HashMap<>();
            mapBanner.put("id", p.getId());
            mapBanner.put("banner", p.getImg_banner());
            listaBanner.add(mapBanner);
        }
        return listaBanner;
    }

    @GetMapping("/dettaglioBanner/{id}")
    public String dettaglioBanner(@RequestParam("id") Integer id, Model model) {
        model.addAttribute("dettaglioBanner", repoPartnership.findById(id).get());
        return "redirect: /filmDettaglio";
    }
}
