document.addEventListener("DOMContentLoaded", () => {
    // =========================================================
    // SCROLL FRECCIA HERO
    // =========================================================

    document.getElementById("scrollDown").addEventListener("click", () => {
        document.getElementById("main").scrollIntoView({ behavior: "smooth" });
    });


    // =========================================================
    // FLIP CARDS
    // =========================================================

    document.querySelectorAll(".card-flip").forEach(card => {
        let frontBtn = card.querySelector(".flip-btn");
        let backBtn  = card.querySelector(".flip-back");

        frontBtn.addEventListener("click", () => {
            // Chiudi tutte le altre
            document.querySelectorAll(".card-flip").forEach(c => {
                c.classList.remove("flipped");
            });
            // Apri solo questa
            card.classList.add("flipped");
        });

        backBtn.addEventListener("click", (e) => {
            e.preventDefault();
            card.classList.remove("flipped");
        });
    });


    // =========================================================
    // BOTTONE ACCEDI E ACQUISTA
    // =========================================================

    let btnAcquista = document.querySelector(".hero-content .btn-warning");

    if (btnAcquista) {
        btnAcquista.addEventListener("click", async function () {

            try {
                const response = await fetch("/membership/membershipAcquistata", {
                    method: "POST"
                });
                console.log("STATUS:", response.status);
                console.log("REDIRECTED:", response.redirected);
                console.log("URL:", response.url);
                console.log("STATUS TEXT:", response.statusText);
                // Utente non loggato — Spring Security reindirizza al login
                if (response.redirected && response.url.includes("/login")) {
                    window.location.href = "/login";
                    return;
                }

                const messaggio = await response.text();

                if (response.ok) {
                    // Membership attivata
                    alert(messaggio); // "Membership attivata con successo! Hai ricevuto X punti."
                    window.location.href = "/utente";
                    return;
                }

                if (response.status === 400) {
                    // Utente ha già la membership
                    alert(messaggio); // "Hai già la membership!"
                    return;
                }

                alert("Si è verificato un errore. Riprova.");

            } catch (error) {
                console.error("Errore acquisto membership:", error);
                alert("Impossibile completare l'acquisto. Sei loggato?");
            }
        });
    }

});