package it.made.cinema.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import it.made.cinema.Model.Offerta;
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
	/*@GetMapping("/filtro")
	public @ResponseBody List<Offerta> filtroOfferte(@RequestParam (name= "filtroOfferta", required = false) String searchOfferta){

		return List;
	}*/
}
