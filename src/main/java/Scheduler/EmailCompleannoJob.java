package Scheduler;

import java.time.LocalDate;
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
		
		for (Utente utente : utenti) {
			Boolean compleanno = utente.getDataNascita().getMonthValue() == oggi.getMonthValue()
					&& utente.getDataNascita().getDayOfMonth() == oggi.getDayOfMonth();
			
			Boolean giaMandataQuestAnno = utente.getAnnoUltimaMailCompleanno() != null
					&& utente.getAnnoUltimaMailCompleanno() != oggi.getYear();
			
		if(compleanno && !giaMandataQuestAnno) {
			SimpleMailMessage messaggio = new SimpleMailMessage();
			messaggio.setTo(utente.getEmail());
			messaggio.setSubject("Buon compleanno, " + utente.getNome()+" "+utente.getCognome()+"!");
			messaggio.setText("Tanti auguri da tutto lo staff di Siediti & Guarda! Per questo evento straordinario abbiamo deciso di reglarti un codice omaggio da poter utilizzare fino al "+oggi.plusDays(6)
			+"per gustarti un film gratuitamente! Il codice omaggio è: Capocchiabagnata ");
			mailSender.send(messaggio);
			
			utente.setAnnoUltimaMailCompleanno(oggi.getYear());
			repoUtenti.save(utente);
			}
		}
	}
}
