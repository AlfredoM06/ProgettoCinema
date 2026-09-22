document.addEventListener("DOMContentLoaded", function () {

    // =====================================================
    // CARD
    // =====================================================

    let cards = document.querySelectorAll('.card');
    let overlay = document.querySelector('.global-overlay');

    cards.forEach(card => {
        // OVERLAY

        if (overlay) {
            card.addEventListener('mouseenter', () => {
                overlay.style.opacity = '1';
            });
            card.addEventListener('mouseleave', () => {
                overlay.style.opacity = '0';
            });
        }

        // CLICK CARD
        card.addEventListener('click', function () {

            // Recupera l'id del film dalla card
            let slide = card.closest('.swiper-slide');

            if (!slide) {
                return;
            }

            // L'id del film viene inserito da Thymeleaf
            let filmId = slide.dataset.filmId;

            if (filmId) {
                window.location.href = "/inSala/dettagli/" + filmId;
            }
        });
    });


    // =====================================================
    // SWIPER FILM IN EVIDENZA
    // =====================================================

    let swiperElement = document.querySelector(".mySwiper");
    let currentElement = document.getElementById("current");
    let totalElement = document.getElementById("total");

    if (swiperElement) {
        // Numero totale dei film
        let numeroFilm = swiperElement.querySelectorAll(".swiper-slide").length;

        // Aggiorna il totale
        if (totalElement) {
            totalElement.textContent = numeroFilm;
        }

        // Inizializza Swiper
        const swiper = new Swiper(".mySwiper", {

            slidesPerView: 3,
            spaceBetween: 10,

            loop: numeroFilm > 3,
            roundLengths: true,
            loopAdditionalSlides: 1,
            watchSlidesProgress: true,

            navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
            },

            on: {
                init: function () {
                    aggiornaCounter(this, numeroFilm);
                },

                slideChange: function () {
                    aggiornaCounter(this, numeroFilm);
                }
            }
        });

        // Se abbiamo 3 film o meno disabilitiamo le frecce
        if (numeroFilm <= 3) {

            let prevButton = document.querySelector(".swiper-button-prev");
            let nextButton = document.querySelector(".swiper-button-next");

            if (prevButton) {
                prevButton.classList.add("swiper-button-disabled");
            }
            if (nextButton) {
                nextButton.classList.add("swiper-button-disabled");
            }
        }
    }


    // =====================================================
    // FUNZIONE COUNTER SWIPER
    // =====================================================

    function aggiornaCounter(swiper, numeroFilm) {
        let currentElement =  document.getElementById("current");
        let totalElement = document.getElementById("total");

        if (!currentElement || !totalElement) {
            return;
        }

        // Totale film
        totalElement.textContent = numeroFilm;

        let posizione;

        /*
         * Se loop è attivo Swiper crea delle slide duplicate.
         * Per questo usiamo realIndex invece di activeIndex.
         */
        if (swiper.params.loop) {
            posizione = swiper.realIndex + 1;

        } else {
            posizione = swiper.activeIndex + 1;
        }

        // Sicurezza
        if (posizione > numeroFilm) {
            posizione = numeroFilm;
        }
        if (posizione < 1) {
            posizione = 1;
        }
        currentElement.textContent = posizione;
    }


    // =====================================================
    // SPONSORSHIP BANNER
    // =====================================================

let filmIdCorrente = null;
let sponsorshipImg = document.getElementById("sponsorshipBannerImg");

if (sponsorshipImg) {
    let defaultBanner = "/img/banner_default_partnership.webp";

    // Mostra inizialmente il banner di default
    sponsorshipImg.src = defaultBanner;


    fetch("/partnership/listaBanner")
        .then(response => {
            if (!response.ok) {
                throw new Error("Errore nel recupero dei banner");
            }
            return response.json();
        })

        .then(partnerships => {
            console.log("PARTNERSHIP:", partnerships);

            // =============================================
            // NESSUNA PARTNERSHIP
            // =============================================

            if (!partnerships || partnerships.length === 0) {
                sponsorshipImg.src = defaultBanner;
                filmIdCorrente = null;
                return;
            }


            // =============================================
            // UNA SOLA PARTNERSHIP
            // DEFAULT + PARTNERSHIP
            // =============================================

            if (partnerships.length === 1) {

                const immagini = [
                    {
                        banner: defaultBanner,
                        filmId: null
                    },
                    partnerships[0]
                ];

                let index = 0;
                sponsorshipImg.src = immagini[index].banner;
                filmIdCorrente = immagini[index].filmId;


                setInterval(() => {
                    index =  (index + 1) % immagini.length;
                    sponsorshipImg.src = immagini[index].banner;
                    filmIdCorrente =  immagini[index].filmId;
                }, 4000);
                return;
            }


            // =============================================
            // PIÙ PARTNERSHIP
            // SOLO PARTNERSHIP
            // =============================================

            let index = 0;
            sponsorshipImg.src = partnerships[index].banner;
            filmIdCorrente = partnerships[index].filmId;

            setInterval(() => {
                index =(index + 1) % partnerships.length;
                sponsorshipImg.src = partnerships[index].banner;
                filmIdCorrente = partnerships[index].filmId;
            }, 4000);
        })
        .catch(error => {
            console.error("Errore caricamento banner partnership:", error);

            sponsorshipImg.src = defaultBanner;
            filmIdCorrente = null;
        });


    // =============================================
    // CLICK SUL BANNER
    // =============================================

    sponsorshipImg.addEventListener("click", function () {

        // Partnership
        if (filmIdCorrente) {

            window.location.href =
                "/inSala/dettagli/" + filmIdCorrente;

            return;
        }

        // Banner default
        window.location.href = "/offerte";
    });
}

    // =====================================================
    // BANNER CINEFANS
    // =====================================================
//    Banner Statici cinefans
    const bannerImages = [
        "/img/banner_homepage.webp",
        "/img/banner_homepage2.webp",
        "/img/banner_homepage3.webp"
    ];

    let bannerIndex = 0;
    const bannerImg = document.getElementById("cinemaBannerImg");

    if (bannerImg) {
        setInterval(() => {
            bannerIndex = (bannerIndex + 1) % bannerImages.length;
            bannerImg.src =  bannerImages[bannerIndex];
        }, 2000);

        // Click su tutti i banner Cinefans
        bannerImg.addEventListener("click", function () {
            window.location.href = "/cinefans";
        });
    }

});