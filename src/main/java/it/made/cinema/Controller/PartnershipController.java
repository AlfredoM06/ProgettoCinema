package it.made.cinema.Controller;

import it.made.cinema.Model.Partnership;
import it.made.cinema.Repository.IRepoPartnership;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Controller
@RequestMapping("/partnership")
public class PartnershipController {

    @Autowired
    IRepoPartnership repoPartnership;

    @GetMapping
    public String bannerPartnership(Model model) {
        List<Partnership> listaBanner = repoPartnership.findAll();
        model.addAttribute("bannerPartner", listaBanner);
        return "";
    }


    @GetMapping("/dettaglioBanner/{id}")
    public String dettaglioBanner(@RequestParam("id") Integer id, Model model) {
        model.addAttribute("dettaglioBanner", repoPartnership.findById(id).get());
        return "";
    }
}
