package it.made.cinema.Security;


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfiguration {

    @Bean
    public DatabaseUserDetailsService userDetailsService(){
        return new DatabaseUserDetailsService();
    }

    @Bean
    public PasswordEncoder passwordEncoder(){
        return PasswordEncoderFactories.createDelegatingPasswordEncoder();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider(){
        DaoAuthenticationProvider authenticationProvider = new DaoAuthenticationProvider();
        authenticationProvider.setUserDetailsService(userDetailsService());
        authenticationProvider.setPasswordEncoder(passwordEncoder());
        return authenticationProvider;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
      http.authorizeHttpRequests()
          .requestMatchers("/biglietto/**").hasAnyAuthority("Admin","User") //solo utente loggato
          .requestMatchers("/carrello/**").hasAnyAuthority("Admin", "User") //solo utente loggato
          .requestMatchers("/cinefans").permitAll()
          .requestMatchers("/admin","/admin/**").hasAuthority("Admin") //solo admin da nascondere
          .requestMatchers("/inSala/**").permitAll()
          .requestMatchers("/login").permitAll()
          .requestMatchers("/membership").permitAll()
          .requestMatchers("/offerte/**").permitAll()
          .requestMatchers("/utente/**").hasAnyAuthority("Admin", "User")
          .requestMatchers("/partnership/**").permitAll()
          .requestMatchers("/prossimamente/**").permitAll()
          .requestMatchers("/", "/**").permitAll()
          .and().formLogin()
          .and().logout()
          .and().exceptionHandling()
          .and().csrf().disable();

      return http.build();
    }
    }

