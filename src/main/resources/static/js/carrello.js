document.addEventListener("DOMContentLoaded", function () {
    console.log("CARRELLO ricevuto:", CARRELLO);
    console.log("listaOfferta:", CARRELLO.listaOfferta);
    console.log("membership:", MEMBERSHIP);
    let cartContainer = document.getElementById("cart-items");
    if (!cartContainer) return;

    // =========================================================
    // DATI DAL BACKEND
    // =========================================================
    let hasMembership = MEMBERSHIP === true;

    let prodotti = [];

    if (CARRELLO && CARRELLO.listaOfferta) {
        let mappaProdotti = new Map();
        CARRELLO.listaOfferta.forEach(offerta => {
            if (mappaProdotti.has(offerta.id)) {
                let prodotto = mappaProdotti.get(offerta.id);
                if (prodotto.quantita < 10) {
                    prodotto.quantita++;
                }
            } else {
                mappaProdotti.set(offerta.id, {
                    ...offerta,
                    quantita: 1
                });
            }
        });
        prodotti = Array.from(mappaProdotti.values());
    }

    // =========================================================
    // FORMATTAZIONE PREZZO
    // =========================================================

    function formattaPrezzo(valore) {
        return Number(valore).toFixed(2).replace(".", ",") + "€";
    }

    // =========================================================
    // RENDER CARRELLO
    // =========================================================

    function renderCarrello() {
        cartContainer.innerHTML = "";

        // =========================================================
        // CARRELLO VUOTO
        // =========================================================

        if (prodotti.length === 0 && !CARRELLO.prezzoCarta) {
            cartContainer.innerHTML = `
                <article class="cart-item empty-cart">
                    <p>Il tuo carrello è vuoto</p>
                </article>
            `;

            aggiornaSummary();
            return;
        }


        // =========================================================
        // OFFERTE
        // =========================================================

        prodotti.forEach(offerta => {

            let cartItem = document.createElement("article");
            cartItem.classList.add("cart-item");
            cartItem.dataset.id = offerta.id;

            const prezzoBlocco = hasMembership
                ? `<div class="price-box">
                        <strong class="final-price">
                            ${formattaPrezzo(offerta.prezzoScontato)}
                        </strong>
                        <span class="old-price">
                            ${formattaPrezzo(offerta.prezzo)}
                        </span>
                        <span class="discount-badge">-10%</span>
                   </div>`
                : `<div class="price-box">
                        <strong class="final-price">
                            ${formattaPrezzo(offerta.prezzo)}
                        </strong>
                   </div>`;

            cartItem.innerHTML = `
                <figure class="cart-img">
                    <img src="${offerta.img_banner}" alt="${offerta.nome}">
                </figure>

                <div class="cart-info">
                    <h2 class="product-title">${offerta.nome}</h2>
                    ${prezzoBlocco}
                </div>

                <div class="quantity-box">
                    <div class="counter">

                        <button type="button"
                                class="quantity-btn btn-minus"
                                data-id="${offerta.id}">
                            <span>-</span>
                        </button>

                        <span class="quantity">${offerta.quantita}</span>

                        <button type="button"
                                class="quantity-btn btn-plus"
                                data-id="${offerta.id}">
                            <span>+</span>
                        </button>

                    </div>

                    <button class="remove-btn"
                            type="button"
                            data-id="${offerta.id}">
                        <i class="fa-regular fa-trash-can"></i>
                    </button>
                </div>
            `;

            cartContainer.appendChild(cartItem);
        });


        // =========================================================
        // CARTA CINEFANS
        // =========================================================

        if (CARRELLO.prezzoCarta) {
            let cartaItem = document.createElement("article");
            cartaItem.classList.add("cart-item", "carta-item");
            cartaItem.id = "carta-item";

            cartaItem.innerHTML = `
                <figure class="cart-img">
                    <img src="${CARRELLO.imgCarta}" alt="${CARRELLO.nomeCarta}">
                </figure>
                <div class="cart-info">
                    <h2 class="product-title">${CARRELLO.nomeCarta}</h2>
                    <div class="price-box">
                        <strong class="final-price">
                            ${formattaPrezzo(CARRELLO.prezzoCarta)}
                        </strong>
                    </div>
                </div>
                <div class="quantity-box">
                    <span class="carta-quantita">Quantità: 1</span>
                    <button class="remove-btn" type="button" id="btn-rimuovi-carta">
                        <i class="fa-regular fa-trash-can"></i>
                    </button>
                </div>
            `;

            cartContainer.appendChild(cartaItem);

            // Listener cestino carta
            document.getElementById("btn-rimuovi-carta").addEventListener("click", async function () {
                try {
                    const response = await fetch("/carrello/eliminaCarta/", { method: "POST" });
                    if (!response.ok) throw new Error("Errore rimozione carta");

                    CARRELLO.prezzoCarta = null;
                    CARRELLO.nomeCarta   = null;
                    CARRELLO.imgCarta    = null;

                    renderCarrello();

                } catch (error) {
                    console.error("Errore rimozione carta:", error);
                    alert("Impossibile rimuovere la Cinefans.");
                }
            });
        }
        aggiornaSummary();
        aggiornaBottoni();
    }
    // =========================================================
    // SUMMARY DINAMICO
    // =========================================================

    function aggiornaSummary() {
    console.log("aggiornaSummary chiamata");
        console.log("prodotti:", prodotti);
        console.log("CARRELLO.prezzoCarta:", CARRELLO.prezzoCarta);
        // PREZZO DI RIFERIMENTO
        let membershipMessage = document.getElementById("membership-message");
        if (membershipMessage) {
            membershipMessage.style.display = hasMembership ? "none" : "block";
        }
        // PREZZO DI RIFERIMENTO

        let prezzoRiferimento = prodotti.reduce((acc, prodotto) => {
            return acc + (Number(prodotto.prezzo) * prodotto.quantita);
    }, 0);


    // SCONTO
    // Differenza tra prezzo originale e prezzo scontato

        let sconto = prodotti.reduce((acc, prodotto) => {
            if (!hasMembership) {
                return acc;
            }
            let prezzoOriginale = Number(prodotto.prezzo);
            let prezzoScontato = Number(prodotto.prezzoScontato);
            let risparmio = prezzoOriginale - prezzoScontato;

            return acc + (risparmio * prodotto.quantita);
        }, 0);


    // =====================================================
    // SUBTOTALE
    // =====================================================

    let subtotale = prodotti.reduce((acc, prodotto) => {

        let prezzo = hasMembership
            ? Number(prodotto.prezzoScontato)
            : Number(prodotto.prezzo);

        return acc + (prezzo * prodotto.quantita);

    }, 0);


    // =====================================================
    // CARTA
    // Se nel carrello c'è una carta, la aggiungiamo
    // una sola volta
    // =====================================================

    if (CARRELLO.prezzoCarta) {
        subtotale += Number(CARRELLO.prezzoCarta);
        prezzoRiferimento += Number(CARRELLO.prezzoCarta);
    }


    // =====================================================
    // ELEMENTI HTML
    // =====================================================

    let riferimento = document.getElementById("summary-prezzo-riferimento");
    let elSconto = document.getElementById("summary-sconto");
    let scontoRow = document.getElementById("summary-sconto-row");
    let elSubtotale = document.getElementById("summary-subtotale");
    let elPunti = document.getElementById("puntiDinamici");


    // =====================================================
    // AGGIORNAMENTO DOM
    // =====================================================

    if (riferimento) {
        riferimento.textContent = formattaPrezzo(prezzoRiferimento);
    }

    if (elSconto) {
        elSconto.textContent = "-" + formattaPrezzo(sconto);
    }

    if (elSubtotale) {
        elSubtotale.textContent = formattaPrezzo(subtotale);
    }


    // =====================================================
    // PUNTI
    // Per ora: 1 punto ogni euro speso
    // =====================================================

    if (elPunti) {
        let puntiCalcolati = Math.floor(subtotale);
        elPunti.textContent = puntiCalcolati + " punti";
    }


    // =====================================================
    // MOSTRA / NASCONDE LO SCONTO
    // =====================================================

    if (scontoRow) {
        scontoRow.style.display = hasMembership ? "" : "none";
    }
}

    // =========================================================
    // BOTTONI + / - / CESTINO
    // =========================================================

    cartContainer.addEventListener("click", function (event) {

        let plusButton   = event.target.closest(".btn-plus");
        let minusButton  = event.target.closest(".btn-minus");
        let removeButton = event.target.closest(".remove-btn");

        // +
        if (plusButton) {
            let id = Number(plusButton.dataset.id);
            let prodotto = prodotti.find(p => p.id === id);
            if (prodotto && prodotto.quantita < 10) {
                prodotto.quantita++;
                let cartItem = plusButton.closest(".cart-item");
                cartItem.querySelector(".quantity").textContent = prodotto.quantita;
            }
            aggiornaBottoni();
            aggiornaSummary();
            return;
        }

        // -
        // -
        if (minusButton) {

            let id = Number(minusButton.dataset.id);
            let prodotto = prodotti.find(p => p.id === id);

            if (!prodotto || prodotto.quantita <= 1) {
                return;
            }

            fetch(`/carrello/rimuoviUno/${id}`, {
                method: "POST"
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Errore rimozione");
                }
                return response.json();
            })
            .then(carrelloDTO => {

                // Il backend ha rimosso una copia
                prodotto.quantita--;

                let cartItem = minusButton.closest(".cart-item");
                cartItem.querySelector(".quantity").textContent = prodotto.quantita;

                // Aggiorno il carrello frontend
                CARRELLO.prezzoFinale =  carrelloDTO.prezzoFinale;
                CARRELLO.punti =  carrelloDTO.punti;

                aggiornaBottoni();
                aggiornaSummary();
            })
            .catch(error => {
                console.error( "Errore rimozione prodotto:",  error );
                alert( "Impossibile rimuovere il prodotto.");
            });
            return;
        }

        // CESTINO — rimuove dal carrello backend + frontend
        // CESTINO — rimuove dal carrello backend + frontend
        if (removeButton) {
            let id = Number(removeButton.dataset.id);

            // ← se non ha data-id è il cestino della carta, lo ignoriamo
            if (!removeButton.dataset.id) return;

            fetch(`/carrello/elimina/${CARRELLO.id}/${id}`, { method: "POST" })
                .then(response => {
                    if (!response.ok) throw new Error("Errore rimozione");
                    prodotti = prodotti.filter(p => p.id !== id);
                    renderCarrello();
                })
                .catch(error => {
                    console.error("Errore rimozione prodotto:", error);
                    alert("Impossibile rimuovere il prodotto.");
                });
        }
    });

    // =========================================================
    // GESTIONE LIMITI + / -
    // =========================================================

    function aggiornaBottoni() {
        let cartItems = cartContainer.querySelectorAll(".cart-item");
        cartItems.forEach(cartItem => {
            let id       = Number(cartItem.dataset.id);
            let prodotto = prodotti.find(p => p.id === id);
            if (!prodotto) return;

            let minusBtn = cartItem.querySelector(".btn-minus");
            let plusBtn  = cartItem.querySelector(".btn-plus");

            if (minusBtn) minusBtn.disabled = prodotto.quantita <= 1;
            if (plusBtn)  plusBtn.disabled  = prodotto.quantita >= 10;
        });
    }

    // =========================================================
    // ACQUISTO — bottone "Acquista Ora"
    // =========================================================

    let btnAcquista = document.getElementById("btn-acquista");

    if (btnAcquista) {
        btnAcquista.addEventListener("click", async function () {

            if (prodotti.length === 0 && !CARRELLO.prezzoCarta) {
                alert("Il carrello è vuoto.");
                return;
            }

            try {
                const response = await fetch("/carrello/confermaAcquisti", {
                    method: "POST"
                });

                if (!response.ok) throw new Error("Errore acquisto");

                alert("Acquisto completato! Grazie.");

                // Svuota frontend
                prodotti = [];

                // Rimuove anche la Cinefans dal frontend
                CARRELLO.prezzoCarta = null;
                CARRELLO.nomeCarta = null;
                CARRELLO.imgCarta = null;

                renderCarrello();

            } catch (error) {
                console.error("Errore conferma acquisto:", error);
                alert("Si è verificato un errore durante l'acquisto.");
            }
        });
    }

    // =========================================================
    // AVVIO
    // =========================================================

    renderCarrello();
});