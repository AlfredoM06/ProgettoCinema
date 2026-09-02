document.addEventListener("DOMContentLoaded", function () {

    let contentWrapper = document.querySelector(".content-wrapper");
    let btnAcquista    = document.getElementById("btnAcquista");
    let prezzoOfferta  = document.getElementById("prezzoOfferta");

    if (!contentWrapper) return;

    let genere   = contentWrapper.dataset.genere;
    let idOfferta = contentWrapper.dataset.id; // ← aggiungi data-id nel th:attr dell'HTML

    if (genere && genere.toLowerCase() === "menu") {

        if (prezzoOfferta) {
            prezzoOfferta.style.display = "block";
        }

        if (btnAcquista) {
            btnAcquista.style.display = "inline-block";
        }
    }

    // =========================================================
    // AGGIUNGI AL CARRELLO
    // =========================================================

    if (btnAcquista) {
        btnAcquista.addEventListener("click", async function () {

            if (!idOfferta) {
                console.error("ID offerta non trovato nel data-id");
                return;
            }

            try {
                const response = await fetch(`/carrello/aggiungi/${idOfferta}`, {
                    method: "POST"
                });
                if (!response.ok) throw new Error("Errore aggiunta al carrello");
                alert("Offerta aggiunta al carrello!");

            } catch (error) {
                console.error("Errore aggiunta carrello:", error);
                alert("Impossibile aggiungere al carrello. Sei loggato?");
            }
        });
    }
});