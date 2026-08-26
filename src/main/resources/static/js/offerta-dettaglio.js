    document.addEventListener("DOMContentLoaded", function () {

        let contentWrapper = document.querySelector(".content-wrapper");
        let btnAcquista = document.getElementById("btnAcquista");

        if (!contentWrapper || !btnAcquista) {
            return;
        }

        let genere = contentWrapper.dataset.genere;

        console.log("Genere offerta:", genere);

        if (genere && genere.toLowerCase() === "menu") {
            btnAcquista.style.display = "inline-block";
        }
    });
