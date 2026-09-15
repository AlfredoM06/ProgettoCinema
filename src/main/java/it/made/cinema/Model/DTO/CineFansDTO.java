package it.made.cinema.Model.DTO;

import lombok.*;

import java.io.Serializable;
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
@EqualsAndHashCode
public class CineFansDTO implements Serializable {
    private String imgCarta;
    private String nome;
    private Integer utilizziCard;
}
