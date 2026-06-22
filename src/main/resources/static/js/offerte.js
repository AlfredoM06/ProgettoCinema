document.addEventListener("DOMContentLoaded", () => {

    let radios = document.querySelectorAll('input[name="filter"]');
    let container = document.getElementById("cardsContainer");

    const BASE_URL_FILM = "/offerte/filtro";

    radios.forEach(radio => {
        radio.addEventListener("change", () => {

            let valore = document.querySelector('input[name="filter"]:checked').value;
            let params = new URLSearchParams();
            if (valore != "all"){
                params.append("filtroOfferta", valore);
            }

            let url = BASE_URL_FILM + "?" + params.toString();

            if (valore === "") {
                valore = "";
            }

            fetch(url)
                .then(response => response.json())
                .then(data => {
                    aggiornaCards(data);
                })
                .catch(error => console.error("Errore:", error));
        });
    });

    function aggiornaCards(lista) {

        container.innerHTML = "";

        lista.forEach(offerta => {

            let html = `
                <article class="card" data-type="${offerta.genere}">
                    <figure class="card-media">
                        <img src="${offerta.img_banner}" alt="Immagine offerta">

                        <div class="card-wave">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                                <path fill="#273444" fill-opacity="1"
                                d="M0,64L48,53.3C96,43,192,21,288,58.7C384,96,480,192,576,218.7C672,245,768,203,864,154.7C960,107,1056,53,1152,32C1248,11,1344,21,1392,26.7L1440,32L1440,320L0,320Z"></path>
                            </svg>
                        </div>

                        <a href="#" class="card-icon">
                            <img class="icon-svg" src="./svg/${offerta.genere}.svg" alt="${offerta.genere}">
                        </a>

                    </figure>

                    <div class="card-body">
                        <h2 class="card-title">${offerta.nome}</h2>
                        <p class="card-text">${offerta.descrizione}</p>
                        <a class="card-link" href="/dettaglio/${offerta.id}">
                            Scopri di più
                        </a>
                    </div>
                </article>
            `;

            container.innerHTML += html;
        });
    }

});