package it.made.cinema.Controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/membership")
public class MembershipController {

    @GetMapping
    public String index(){
        return "membership";
    }

    // acquisto della membership , il resto dei metodi sono nei service e nel biglietto controller

    //fare acquisto


}
