document.addEventListener("DOMContentLoaded", function () {
    let container = document.getElementById("offerte-container");
    // Se questa pagina non contiene il fragment delle offerte, non fare nulla.
    if (!container) {
        return;
    }

    fetch("/offerte/top3")
        .then(response => {
            if (!response.ok) {
                throw new Error("Errore nel caricamento delle offerte");
            }
            return response.json();
        })
        .then(data => {
            console.log("TOP 3 RICEVUTE:", data);
            container.innerHTML = "";
            data.forEach(offerta => {

                console.log("OFFERTA:", offerta.nome);
                console.log("IMG TOP:", offerta.imgBannerTopOfferte);

                let card = `
                    <div class="col-lg-4 mt-4">
                        <div class="card">

                            <div class="card-img-wrap">
                                <img
                                    src="${offerta.imgBannerTopOfferte}"
                                    class="card-img-novita"
                                    alt="${offerta.nome}">
                            </div>

                            <div class="card-body">
                                <time datetime="${offerta.dataInizio}">
                                    ${formatDate(offerta.dataInizio)}
                                </time>

                                <h5 class="card-title">
                                    ${offerta.nome}
                                </h5>

                                <a href="/offerte/dettagli/${offerta.id}">
                                    Leggi di più
                                </a>
                            </div>

                        </div>
                    </div>
                `;

                container.insertAdjacentHTML("beforeend", card);
            });
        })
        .catch(error => {
            console.error("Errore nel caricamento offerte:", error);
        });

//     FORMATTAZIONE DATA
    function formatDate(dateString) {
        let [year, month, day] = dateString.split("-");
        let date = new Date(year, month - 1, day);
        return date.toLocaleDateString("it-IT", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    }
});