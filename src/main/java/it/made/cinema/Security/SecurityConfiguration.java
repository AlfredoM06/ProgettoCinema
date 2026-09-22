package it.made.cinema.Security;


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.LoginUrlAuthenticationEntryPoint;

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

   /* @Bean   METODO VECCHIO E CHE CREAVA ANCHE PROBLEMI PER OBSOLESCENZA
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
      http.authorizeHttpRequests()
          .requestMatchers("/biglietto/**").hasAnyAuthority("Admin","User") //solo utente loggato
          .requestMatchers("/carrello", "/carrello/**").hasAnyAuthority("Admin", "User") //solo utente loggato
          .requestMatchers("/cinefans").permitAll()
          .requestMatchers("/admin","/admin/**").hasAuthority("Admin") //solo admin da nascondere
          .requestMatchers("/inSala/**").permitAll()
          .requestMatchers("/login").permitAll()
          .requestMatchers("/membership").permitAll()
          .requestMatchers("/offete").permitAll()
          .requestMatchers("/utente/**").hasAnyAuthority("Admin", "User")
          .requestMatchers("/partnership/**").permitAll()
          .requestMatchers("/prossimamente/**").permitAll()
          .anyRequest().permitAll()
          .and().formLogin().loginPage("/login").failureUrl("/login/login-error")
          .and().logout().logoutUrl("/logout").logoutSuccessUrl("/").clearAuthentication(true).invalidateHttpSession(true)
          .and().exceptionHandling()
          .and().csrf().disable();
      return http.build();
    }*/

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .authorizeHttpRequests(auth -> auth
                        // --- pubbliche ---
                        .requestMatchers("/", "/login", "/logout").permitAll()
                        .requestMatchers("/offete", "/cinefans").permitAll()
                        .requestMatchers("/inSala/**", "/prossimamente/**", "/partnership/**").permitAll()
                        .requestMatchers("/css/**", "/js/**", "/img/**", "/webjars/**").permitAll()

                        // --- membership: pagina pubblica, acquisto protetto ---
                        .requestMatchers(HttpMethod.POST, "/membership/membershipAcquistata").hasAnyAuthority("Admin", "User")
                        .requestMatchers("/membership").permitAll()

                        // --- gestioneProgrammazione: solo il dettaglio richiede login, il resto è admin-only ---
                        .requestMatchers(HttpMethod.GET, "/gestioneProgrammazione/dettagliProgrammazione/**").hasAnyAuthority("Admin", "User")
                        .requestMatchers("/gestioneProgrammazione/**").hasAuthority("Admin")

                        // --- protette ---
                        .requestMatchers("/biglietto/**").hasAnyAuthority("Admin", "User")
                        .requestMatchers("/carrello", "/carrello/**").hasAnyAuthority("Admin", "User")
                        .requestMatchers("/utente/**").hasAnyAuthority("Admin", "User")
                        .requestMatchers("/admin", "/admin/**").hasAuthority("Admin")

                        // --- fallback sicuro ---
                        .anyRequest().authenticated()
                )
                .formLogin(form -> form
                        .loginPage("/login")
                        .failureUrl("/login?error")
                )
                .logout(logout -> logout
                        .logoutUrl("/logout")
                        .logoutSuccessUrl("/")
                        .clearAuthentication(true)
                        .invalidateHttpSession(true)
                )
                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint(new LoginUrlAuthenticationEntryPoint("/login"))
                )
                .csrf(csrf -> csrf.disable());
        return http.build();
    }
}