document.addEventListener("DOMContentLoaded", function () {
    console.log("CARRELLO ricevuto:", CARRELLO);
    console.log("listaOfferta:", CARRELLO.listaOfferta);
    console.log("membership:", MEMBERSHIP);
    let cartContainer = document.getElementById("cart-items");
    if (!cartContainer) return;

    // =========================================================
    // DATI DAL BACKEND
    // =========================================================

    const hasMembership = CARRELLO.membership === true;
    const SCONTO_PERCENTUALE = 0.10; // 10% fisso lato frontend

    let prodotti = [];
    if (CARRELLO && CARRELLO.listaOfferta) {
        prodotti = CARRELLO.listaOfferta.map(p => ({
            ...p,
            quantita: 1
        }));
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

        if (prodotti.length === 0) {
            cartContainer.innerHTML = `
                <article class="cart-item empty-cart">
                    <p>Il tuo carrello è vuoto</p>
                </article>
            `;
            aggiornaSummary();
            return;
        }

        prodotti.forEach(offerta => {
            let cartItem = document.createElement("article");
            cartItem.classList.add("cart-item");
            cartItem.dataset.id = offerta.id;

            const prezzoOriginale = Number(offerta.prezzo);
            const prezzoScontato  = prezzoOriginale * (1 - SCONTO_PERCENTUALE);

            // Blocco prezzo — cambia in base alla membership
            const prezzoBlocco = hasMembership
                ? `<div class="price-box">
                        <strong class="final-price">
                            ${formattaPrezzo(prezzoScontato)}
                        </strong>
                        <span class="old-price">
                            ${formattaPrezzo(prezzoOriginale)}
                        </span>
                        <span class="discount-badge">-10%</span>
                   </div>`
                : `<div class="price-box">
                        <strong class="final-price">
                            ${formattaPrezzo(prezzoOriginale)}
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
                    <button class="remove-btn" type="button" data-id="${offerta.id}">
                        <i class="fa-regular fa-trash-can"></i>
                    </button>
                </div>
            `;
            cartContainer.appendChild(cartItem);
        });

        aggiornaBottoni();
        aggiornaSummary();
    }

    // =========================================================
    // SUMMARY DINAMICO
    // =========================================================

    function aggiornaSummary() {

        // Prezzo di riferimento = somma prezzi pieni * quantità
        let prezzoRiferimento = prodotti.reduce((acc, o) => {
            return acc + Number(o.prezzo) * o.quantita;
        }, 0);

        let subtotale = prezzoRiferimento;
        let sconto    = 0;

        if (hasMembership) {
            sconto    = prezzoRiferimento * SCONTO_PERCENTUALE;
            subtotale = prezzoRiferimento - sconto;
        }

        // Aggiorna DOM
        let elRiferimento = document.getElementById("summary-prezzo-riferimento");
        let elSconto      = document.getElementById("summary-sconto");
        let elScontoRow   = document.getElementById("summary-sconto-row");
        let elSubtotale   = document.getElementById("summary-subtotale");
        let elPunti       = document.getElementById("puntiDinamici");

        if (elRiferimento) elRiferimento.textContent = formattaPrezzo(prezzoRiferimento);
        if (elSconto)      elSconto.textContent      = "-" + formattaPrezzo(sconto);
        if (elSubtotale)   elSubtotale.textContent   = formattaPrezzo(subtotale);

        // Punti calcolati sul subtotale (1 punto ogni euro)
        if (elPunti) {
            let punti = Math.floor(subtotale);
            elPunti.textContent = punti + " punti";
        }

        // Nasconde la riga sconto se non ha membership
        if (elScontoRow) {
            elScontoRow.style.display = hasMembership ? "" : "none";
        }
    }

    // =========================================================
    // BOTTONI + / - / CESTINO
    // =========================================================

    cartContainer.addEventListener("click", function (event) {

        const plusButton   = event.target.closest(".btn-plus");
        const minusButton  = event.target.closest(".btn-minus");
        const removeButton = event.target.closest(".remove-btn");

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
        if (minusButton) {
            let id = Number(minusButton.dataset.id);
            let prodotto = prodotti.find(p => p.id === id);
            if (prodotto && prodotto.quantita > 1) {
                prodotto.quantita--;
                let cartItem = minusButton.closest(".cart-item");
                cartItem.querySelector(".quantity").textContent = prodotto.quantita;
            }
            aggiornaBottoni();
            aggiornaSummary();
            return;
        }

        // CESTINO — rimuove dal carrello backend + frontend
        if (removeButton) {
            let id = Number(removeButton.dataset.id);

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

            if (prodotti.length === 0) {
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