package it.made.cinema.Scheduler;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import it.made.cinema.Model.Utente;
import it.made.cinema.Repository.IRepoUtenti;

@Component
public class EmailCompleannoJob {
	
	@Autowired
	private IRepoUtenti repoUtenti;
	
	@Autowired
	private JavaMailSender mailSender;
	
	
	@Scheduled(cron = "0 1 0 * * *")
	public void emailCompleanno() {
		LocalDate oggi = LocalDate.now();
		List<Utente> utenti = repoUtenti.findAll();
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
		String scadenza = oggi.plusDays(6).format(formatter);
		
		for (Utente utente : utenti) {
			Boolean compleanno = utente.getDataNascita().getMonthValue() == oggi.getMonthValue()
					&& utente.getDataNascita().getDayOfMonth() == oggi.getDayOfMonth();
			
			Boolean giaMandataQuestAnno = utente.getAnnoUltimaMailCompleanno() != null
					&& utente.getAnnoUltimaMailCompleanno() == oggi.getYear();
			
			Boolean membro = utente.getMembership();
			
		if(compleanno && !giaMandataQuestAnno) {
			if(membro) {
			SimpleMailMessage messaggio = new SimpleMailMessage();
			messaggio.setTo(utente.getEmail());
			messaggio.setSubject("Buon compleanno, " + utente.getNome()+" "+utente.getCognome()+"!");
			messaggio.setText("Tanti auguri da tutto lo staff di Siediti & Guarda! Per questo evento straordinario abbiamo deciso di regalarti un codice omaggio da poter utilizzare fino al "+ scadenza 
			+" per gustarti un film gratuitamente! Il codice omaggio è: Freefilm\nInoltre dato che sei membro S&G ecco a te il codice da inserire per avere punti sulla nostra carta membership: addpoints");
			mailSender.send(messaggio);
			
			utente.setAnnoUltimaMailCompleanno(oggi.getYear());
			repoUtenti.save(utente);
				}
			else {
				SimpleMailMessage messaggio = new SimpleMailMessage();
				messaggio.setTo(utente.getEmail());
				messaggio.setSubject("Buon compleanno, " + utente.getNome()+" "+utente.getCognome()+"!");
				messaggio.setText("Tanti auguri da tutto lo staff di Siediti & Guarda! Per questo evento straordinario abbiamo deciso di regalarti un codice omaggio da poter utilizzare fino al "+ scadenza 
				+" per gustarti un film gratuitamente! Il codice omaggio è: Freefilm");
				mailSender.send(messaggio);
				
				utente.setAnnoUltimaMailCompleanno(oggi.getYear());
				repoUtenti.save(utente);
			}
			}
		}
	}
}
