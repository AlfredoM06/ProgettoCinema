document.addEventListener("DOMContentLoaded", function () {
    let cards = document.querySelectorAll('.card');
    let overlay = document.querySelector('.global-overlay');

    if (overlay) {
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                overlay.style.opacity = '1';
            });

            card.addEventListener('mouseleave', () => {
                overlay.style.opacity = '0';
            });
        });
    }

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

    // =====================================================
    //                  OFFERTE TOP 3
    // =====================================================
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


    // format data x offerte
    function formatDate(dateString) {
        let [year, month, day] = dateString.split("-");

        let date = new Date(year, month - 1, day);

        return date.toLocaleDateString("it-IT", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    }

     // =====================================================
     // SPONSORSHIP BANNER
     // =====================================================

     let sponsorshipImg = document.getElementById("sponsorshipBannerImg");

     if (sponsorshipImg) {
         let defaultBanner = "/img/banner_default_partnership.webp";
         console.log("SPONSORSHIP IMG TROVATA:", sponsorshipImg);
         console.log("SRC INIZIALE:", sponsorshipImg.getAttribute("src"));
         console.log("SRC ASSOLUTO:", sponsorshipImg.src);

         // Impostiamo esplicitamente il default
         sponsorshipImg.src = defaultBanner;

         fetch("/partnership/listaBanner")
             .then(response => {
                 if (!response.ok) {
                     throw new Error("Errore nel recupero dei banner");
                 }
                 return response.json();
             })
             .then(partnerships => {
                 console.log("PARTNERSHIP RICEVUTE:", partnerships);

                 // NESSUNA PARTNERSHIP
                 if (!partnerships || partnerships.length === 0) {
                     console.log("NESSUNA PARTNERSHIP");
                     console.log("MOSTRO:", defaultBanner);
                     sponsorshipImg.src = defaultBanner;
                     return;
                 }


                 // UNA SOLA PARTNERSHIP
                 // DEFAULT + PARTNERSHIP
                 if (partnerships.length === 1) {
                     console.log("UNA PARTNERSHIP");
                     const immagini = [
                         defaultBanner,
                         partnerships[0].banner
                     ];
                     console.log("SLIDES:", immagini);

                     let index = 0;
                     sponsorshipImg.src = immagini[index];
                     setInterval(() => {
                         index = (index + 1) % immagini.length;
                         console.log(
                             "CAMBIO BANNER:",
                             immagini[index]
                         );
                         sponsorshipImg.src = immagini[index];
                     }, 4000);
                     return;
                 }

                 // PIÙ PARTNERSHIP
                 // SOLO PARTNERSHIP
                 console.log("PIÙ PARTNERSHIP:", partnerships.length);
                 let index = 0;
                 sponsorshipImg.src = partnerships[index].banner;
                 setInterval(() => {
                     index = (index + 1) % partnerships.length;
                     console.log(
                         "CAMBIO PARTNERSHIP:",
                         partnerships[index].banner
                     );
                     sponsorshipImg.src = partnerships[index].banner;
                 }, 4000);
             })
             .catch(error => {
                 console.error(
                     "Errore caricamento banner partnership:",
                     error
                 );
                 // In caso di errore mostra sempre il default
                 sponsorshipImg.src = defaultBanner;
             });
     }

     //    BANNER SCORRIMENTO X CINEFANS
         const bannerImages = [
             "/img/banner_homepage.webp",
             "/img/banner_homepage2.webp",
             "/img/banner_homepage3.webp"
           ];

           let bannerIndex = 0;
           const bannerImg = document.getElementById("cinemaBannerImg");

           setInterval(() => {
             bannerIndex = (bannerIndex + 1) % bannerImages.length;
             bannerImg.src = bannerImages[bannerIndex];
           }, 2000);

});

