let cartTotale = 0;

function aggiornaBadgeCarrello(totale) {
    cartTotale = Number(totale) || 0;

    let badge = document.getElementById("cart-badge");
    if (!badge) return;

    if (cartTotale > 0) {
        badge.textContent   = cartTotale > 99 ? "99+" : cartTotale;
        badge.style.display = "flex";
    } else {
        badge.style.display = "none";
    }
}

function incrementaBadge() {
    aggiornaBadgeCarrello(cartTotale + 1);
}

function decrementaBadge() {
    aggiornaBadgeCarrello(Math.max(0, cartTotale - 1));
}

async function caricaBadgeDalServer() {
   	
	 try {
        const response = await fetch("/carrello/conteggio", { cache: "no-store" });
        if (!response.ok) throw new Error();
        aggiornaBadgeCarrello(await response.json());
    } catch (e) {
        aggiornaBadgeCarrello(0);
    }
}

document.addEventListener("DOMContentLoaded", caricaBadgeDalServer);