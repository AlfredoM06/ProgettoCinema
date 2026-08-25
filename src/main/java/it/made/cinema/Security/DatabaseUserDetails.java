package it.made.cinema.Security;


import it.made.cinema.Model.Carrello;
import it.made.cinema.Model.NomeCarta;
import it.made.cinema.Model.Offerta;
import it.made.cinema.Model.Ruolo;
import it.made.cinema.Model.Utente;
import jakarta.persistence.Column;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
@EqualsAndHashCode
public class DatabaseUserDetails implements UserDetails {
    private Integer id;
    private String username;
    private String password;
    private Set<GrantedAuthority> authorities;

    public DatabaseUserDetails(Utente utente) {
        this.id = utente.getId();
        this.username = utente.getUsername();
        this.password = utente.getPassword();
        authorities = new HashSet<>();
        authorities.add(new SimpleGrantedAuthority(utente.getRuolo().getNome()));
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }
}
