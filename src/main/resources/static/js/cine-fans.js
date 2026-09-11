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

                /// Spring Security ha reindirizzato al login
                 if (response.redirected) {
                     if (response.url.includes("/login")) {
                         alert("Devi effettuare il login per aggiungere una Cinefans al carrello.");
                         return;
                     }
                     window.location.href = response.url;
                     return;
                 }

                 // ← ELIMINA il vecchio blocco "PRIMA" con if(!response.ok) e la prima const body
                 // ← TIENI SOLO QUESTO:

                 const body = await response.text();
                 const valore = parseFloat(body);

                 if (valore === -1) {
                     alert("Hai già una Cinefans attiva.");
                     return;
                 }

                 if (valore === -2) {
                     alert("Hai già una Cinefans nel carrello. Rimuovila prima di aggiungerne un'altra.");
                     return;
                 }

                 if (!response.ok) {
                     throw new Error("Errore aggiunta carta al carrello");
                 }

                 alert("Cinefans aggiunta al carrello!");

            } catch (error) {

                console.error("Errore aggiunta carta:", error);
                alert("Impossibile aggiungere la Cinefans al carrello.");
            }
        });
    }

});