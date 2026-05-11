package it.made.cinema.Controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/")
public class HomeController {

    @GetMapping String home(){
        return "home";
    }

    @GetMapping("/dettagli")
    public String dettagli(){
        return "dettagli";
    }
    @GetMapping("/inSala")
    public String inSala(){
        return "inSala";
    }
    @GetMapping("/login")
    public String login(){
        return "login";
    }
    @GetMapping("/membership")
    public String membership(){
        return "membership";
    }
    @GetMapping("/prossimamente")
    public String prossimamente(){
        return "prossimamente";
    }

    // redirect da fare nella home = dettagli(film e shop), shop, prenota ecc.


}
