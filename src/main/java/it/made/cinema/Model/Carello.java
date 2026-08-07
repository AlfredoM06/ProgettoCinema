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
public class Carello {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @OneToOne(mappedBy = "carello")
    private Utente utente;

    @ManyToMany
    @JoinTable(name="offerta", joinColumns=@JoinColumn(name="id_carello"),inverseJoinColumns=@JoinColumn(name="id_offerta"))
    private List<Offerta> listaOfferte;

}
