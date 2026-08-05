package it.made.cinema.Service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import it.made.cinema.Model.PostiOccupati;
import it.made.cinema.Model.ProgrammazioneFilm;
import it.made.cinema.Model.Sala;
import it.made.cinema.Model.Utente;
import it.made.cinema.Model.DTO.PostiDTO;
import it.made.cinema.Repository.IRepoProgrammazione;
import it.made.cinema.Repository.IRepoSala;

@Service
public class PostiService {
	
	@Autowired
	IRepoSala repoSala;
	@Autowired
	IRepoProgrammazione repoProgrammazione;
	
	public PostiDTO[][] getPosti(Integer id_programmazione){
		Optional<ProgrammazioneFilm> programmazioneOpt = repoProgrammazione.findById(id_programmazione);
        if (programmazioneOpt.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Programmazione non trovata");
        }
        ProgrammazioneFilm programmazione = programmazioneOpt.get();
    	String posti = programmazione.getSala().getPosti();
        List<PostiOccupati> postiOccupati = programmazione.getListaPostiOccupati();
        PostiDTO[][] matricePosti = new PostiDTO[10][10];
        int indiceX = 0;
        int indiceY = 0;
        for(int i=0; i<posti.length();i++) {
        	PostiDTO postoSala = new PostiDTO();
        	postoSala.setId(indiceX+"_"+indiceY);
        	postoSala.setTipo(Integer.parseInt(String.valueOf(posti.charAt(i))));
        	postoSala.setOccupato(false);
        	if(!postiOccupati.isEmpty()) {
        		for(PostiOccupati posto:postiOccupati) {
        			if(postoSala.getId().equals(posto.getPosizione())) {
        				postoSala.setOccupato(true);
        				break;
        			}
        		}
        	}
        	matricePosti[indiceX][indiceY]=postoSala;
        	indiceY++;
        	if(indiceY>9) {
        		indiceY = 0;
        		indiceX++;
        	}
        	if(indiceX>9) {
				break;
        	}
        }
		return matricePosti;
	}
}
