document.addEventListener("DOMContentLoaded", () => {

    let modal = document.getElementById("cineModal");

    let modalImg = document.getElementById("modal-img");
    let modalTitle = document.getElementById("modal-title");
    let modalPrice = document.getElementById("modal-price");
    let modalDesc = document.getElementById("modal-desc");

    let btnAggiungiCarta = document.getElementById("btnAggiungiCarta");

    let acc1 = document.getElementById("acc-1");
    let acc2 = document.getElementById("acc-2");
    let acc3 = document.getElementById("acc-3");

    // ID della carta attualmente visualizzata nella modal
    let idCartaSelezionata = null;


    modal.addEventListener("show.bs.modal", (event) => {

        let card = event.relatedTarget;

        // SALVO L'ID DELLA CARTA
        idCartaSelezionata = card.dataset.id;

        // MODAL DATA
        modalTitle.textContent = card.dataset.title;
        modalPrice.textContent = card.dataset.price;
        modalImg.src = card.dataset.img;
        modalDesc.textContent = card.dataset.desc;

        // ACCORDION DATA
        acc1.textContent = card.dataset.acc1;
        acc2.textContent = card.dataset.acc2;
        acc3.textContent = card.dataset.acc3;

    });


    // =========================================================
    // AGGIUNGI CARTA AL CARRELLO
    // =========================================================

    if (btnAggiungiCarta) {

        btnAggiungiCarta.addEventListener("click", async function () {

            if (!idCartaSelezionata) {
                console.error("ID carta non trovato");
                return;
            }

            try {

                const response = await fetch(
                    `/carrello/acquistaCarta/${idCartaSelezionata}`,
                    {
                        method: "POST"
                    }
                );

                // Spring Security ha reindirizzato al login
                if (response.redirected) {

                    if (response.url.includes("/login")) {
                        alert("Devi effettuare il login per aggiungere una Cinefans al carrello.");
                        return;
                    }

                    // Eventuale altro redirect
                    window.location.href = response.url;
                    return;
                }

                if (!response.ok) {
                    throw new Error("Errore aggiunta carta al carrello");
                }

                const prezzo = await response.json();

                // L'utente possiede già una carta
                if (prezzo === -1) {
                    alert("Hai già una Cinefans.");
                    return;
                }

                // Carta aggiunta correttamente
                alert("Cinefans aggiunta al carrello!");

                window.location.href = "/carrello";

            } catch (error) {

                console.error("Errore aggiunta carta:", error);
                alert("Impossibile aggiungere la Cinefans al carrello.");
            }
        });
    }

});