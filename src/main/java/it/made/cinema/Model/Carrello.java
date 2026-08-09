package it.made.cinema.Model;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
@EqualsAndHashCode
@Table(name="carrelli")
public class Carrello {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @OneToOne(mappedBy = "carrello")
    private Utente utente;

    @ManyToMany
    @JoinTable(name="carello_offerta", joinColumns=@JoinColumn(name="id_carrello"),inverseJoinColumns=@JoinColumn(name="id_offerta"))
    private List<Offerta> listaOfferte;

}
