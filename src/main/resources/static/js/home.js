let cards = document.querySelectorAll('.card');
let overlay = document.querySelector('.global-overlay');

/* style card*/
cards.forEach(card => {
  card.addEventListener('mouseenter', () => {
    overlay.style.opacity = '1';
  });

  card.addEventListener('mouseleave', () => {
    overlay.style.opacity = '0';
  });
});

// CONTROLLO FRECCE SWIPER
document.querySelector(".swiper-button-next").addEventListener("click", () => {
  let swiper = document.querySelector(".mySwiper").swiper;

  swiper.currentPage++;

  if (swiper.currentPage > swiper.totalPages) {
    swiper.currentPage = 1;
  }

  document.getElementById("current").textContent = swiper.currentPage;
});

document.querySelector(".swiper-button-prev").addEventListener("click", () => {
  let swiper = document.querySelector(".mySwiper").swiper;

  swiper.currentPage--;

  if (swiper.currentPage < 1) {
    swiper.currentPage = swiper.totalPages;
  }

  document.getElementById("current").textContent = swiper.currentPage;
});

// CARD TOP 3

document.addEventListener("DOMContentLoaded", function () {

    fetch("/offerte/top3")
        .then(response => response.json())
        .then(data => {

            let container = document.getElementById("offerte-container");
            container.innerHTML = "";
            data.forEach(offerta => {

                let card = `
                    <div class="col-lg-4 mt-4">
                        <div class="card">

                            <div class="card-img-wrap">
                                <img src="${offerta.imgBanner}" class="card-img-novita" alt="offerta">
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

                container.innerHTML += card;
            });
        })
        .catch(error => {
            console.error("Errore nel caricamento offerte:", error);
        });


    // helper per formattare la data
    function formatDate(dateString) {
        const [year, month, day] = dateString.split("-");

        const date = new Date(year, month - 1, day);

        return date.toLocaleDateString("it-IT", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    }

});