package it.made.cinema.Model.DTO;

import lombok.*;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;


@AllArgsConstructor
@Getter
@Setter
@ToString
@EqualsAndHashCode
public class ScontrinoDTO implements Serializable {
    List<BigliettoAcquistatoDTO> bigliettiAcquistati;
    Double prezzoTotale;
    Integer puntiGuadagnati;

    public ScontrinoDTO() {
        this.bigliettiAcquistati = new ArrayList<>();
    }
}
