package it.made.cinema.Controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/")
public class HomeController {
    //c'è la pagina
    @GetMapping String home(){

        //lista dei film, log in, dettagli dei film, dettagli dei gadgets, prenota(redirect), vedi tutti gadget(redirect)

        return "Home";
    }
    /*
    @GetMapping("/dettagli")
    public String dettagli(){
        return "filmDettaglio";
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
    */


    // redirect da fare nella home = dettagli(film e shop), shop, prenota ecc.


}
