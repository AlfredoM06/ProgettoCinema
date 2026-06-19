package it.made.cinema.Model.DTO;


import lombok.*;

import java.io.Serializable;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
@EqualsAndHashCode
public class ListaFilmDTO implements Serializable {
    private Integer id;
    private String titolo;
    private String img_poster;
}
