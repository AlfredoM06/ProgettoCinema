package it.made.cinema.Controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/cinefans")
public class CineFansController {

    @GetMapping
    public String paginaCinefans(){
        return "cine-fans";
    }
    //ancora da fare

}
