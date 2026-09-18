// =========================================================
// BADGE CARRELLO — condiviso tra tutte le pagine
// =========================================================

function aggiornaBadgeCarrello(totale) {
    let badge = document.getElementById("cart-badge");
    if (!badge) return;

    sessionStorage.setItem("cartTotale", totale);

    if (totale > 0) {
        badge.textContent   = totale > 99 ? "99+" : totale;
        badge.style.display = "flex";
    } else {
        badge.style.display = "none";
    }
}

function incrementaBadge() {
    let attuale = parseInt(sessionStorage.getItem("cartTotale")) || 0;
    aggiornaBadgeCarrello(attuale + 1);
}

function decrementaBadge() {
    let attuale = parseInt(sessionStorage.getItem("cartTotale")) || 0;
    aggiornaBadgeCarrello(Math.max(0, attuale - 1));
}

document.addEventListener("DOMContentLoaded", () => {
    let salvato = parseInt(sessionStorage.getItem("cartTotale")) || 0;
    if (salvato > 0) {
        aggiornaBadgeCarrello(salvato);
    }
});