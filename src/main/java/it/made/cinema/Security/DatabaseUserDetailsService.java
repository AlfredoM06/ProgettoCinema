package it.made.cinema.Security;
/*
import it.made.cinema.Model.Utente;
import it.made.cinema.Repository.IRepoUtenti;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class DatabaseUserDetailsService implements UserDetailsService {

    @Autowired
    IRepoUtenti repoUtenti;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<Utente> utente = repoUtenti.findByUsername(username);
        if (utente.isPresent()){
            return new DatabaseUserDetails(utente.get());
        }else {
            throw new UsernameNotFoundException(username);
        }
    }
}*/
