package it.made.cinema.Controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/inSala")
public class InSalaController {

    //da vedere come si fa
@PostMapping()
    public String form(){
        return "redirect: /inSala";
}

}
