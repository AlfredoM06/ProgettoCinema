document.addEventListener("DOMContentLoaded", function () {

    let contentWrapper = document.querySelector(".content-wrapper");
    let btnAcquista = document.getElementById("btnAcquista");
    let prezzoOfferta = document.getElementById("prezzoOfferta");

    if (!contentWrapper) {
        return;
    }

    let genere = contentWrapper.dataset.genere;

    console.log("Genere offerta:", genere);

    if (genere && genere.toLowerCase() === "menu") {

        // Mostra il prezzo
        if (prezzoOfferta) {
            prezzoOfferta.style.display = "block";
        }

        // Mostra il pulsante acquista
        if (btnAcquista) {
            btnAcquista.style.display = "inline-block";
        }
    }
});