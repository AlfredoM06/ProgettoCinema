document.addEventListener("DOMContentLoaded", function () {

    // =====================================================
    // CARD
    // =====================================================

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


    // =====================================================
    // SWIPER FILM IN EVIDENZA
    // =====================================================

    const swiperElement = document.querySelector(".mySwiper");
    const currentElement = document.getElementById("current");
    const totalElement = document.getElementById("total");

    if (swiperElement) {

        // Numero totale dei film
        const numeroFilm = swiperElement.querySelectorAll(".swiper-slide").length;

        console.log("FILM IN EVIDENZA:", numeroFilm);

        // Aggiorna il totale
        if (totalElement) {
            totalElement.textContent = numeroFilm;
        }

        // Inizializza Swiper
        const swiper = new Swiper(".mySwiper", {

            slidesPerView: 3,
            spaceBetween: 10,

            loop: numeroFilm > 3,
             roundLengths: numeroFilm > 3,
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

            const prevButton =
                document.querySelector(".swiper-button-prev");

            const nextButton =
                document.querySelector(".swiper-button-next");

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

        const currentElement =
            document.getElementById("current");

        const totalElement =
            document.getElementById("total");

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

    let sponsorshipImg =
        document.getElementById("sponsorshipBannerImg");

    if (sponsorshipImg) {

        let defaultBanner =
            "/img/banner_default_partnership.webp";

        console.log(
            "SPONSORSHIP IMG TROVATA:",
            sponsorshipImg
        );

        console.log(
            "SRC INIZIALE:",
            sponsorshipImg.getAttribute("src")
        );

        console.log(
            "SRC ASSOLUTO:",
            sponsorshipImg.src
        );

        // Mostra inizialmente il banner di default
        sponsorshipImg.src = defaultBanner;


        fetch("/partnership/listaBanner")

            .then(response => {

                if (!response.ok) {
                    throw new Error(
                        "Errore nel recupero dei banner"
                    );
                }

                return response.json();
            })

            .then(partnerships => {

                console.log(
                    "PARTNERSHIP RICEVUTE:",
                    partnerships
                );


                // NESSUNA PARTNERSHIP
                if (
                    !partnerships ||
                    partnerships.length === 0
                ) {

                    console.log(
                        "NESSUNA PARTNERSHIP"
                    );

                    sponsorshipImg.src =
                        defaultBanner;

                    return;
                }


                // UNA SOLA PARTNERSHIP
                // DEFAULT + PARTNERSHIP
                if (partnerships.length === 1) {

                    console.log(
                        "UNA PARTNERSHIP"
                    );

                    const immagini = [
                        defaultBanner,
                        partnerships[0].banner
                    ];

                    console.log(
                        "SLIDES:",
                        immagini
                    );

                    let index = 0;

                    sponsorshipImg.src =
                        immagini[index];

                    setInterval(() => {

                        index =
                            (index + 1) %
                            immagini.length;

                        console.log(
                            "CAMBIO BANNER:",
                            immagini[index]
                        );

                        sponsorshipImg.src =
                            immagini[index];

                    }, 4000);

                    return;
                }


                // PIÙ PARTNERSHIP
                // SOLO PARTNERSHIP

                console.log(
                    "PIÙ PARTNERSHIP:",
                    partnerships.length
                );

                let index = 0;

                sponsorshipImg.src =
                    partnerships[index].banner;

                setInterval(() => {

                    index =
                        (index + 1) %
                        partnerships.length;

                    console.log(
                        "CAMBIO PARTNERSHIP:",
                        partnerships[index].banner
                    );

                    sponsorshipImg.src =
                        partnerships[index].banner;

                }, 4000);
            })

            .catch(error => {

                console.error(
                    "Errore caricamento banner partnership:",
                    error
                );

                sponsorshipImg.src =
                    defaultBanner;
            });
    }


    // =====================================================
    // BANNER CINEFANS
    // =====================================================

    const bannerImages = [
        "/img/banner_homepage.webp",
        "/img/banner_homepage2.webp",
        "/img/banner_homepage3.webp"
    ];

    let bannerIndex = 0;

    const bannerImg =
        document.getElementById("cinemaBannerImg");

    if (bannerImg) {

        setInterval(() => {

            bannerIndex =
                (bannerIndex + 1) %
                bannerImages.length;

            bannerImg.src =
                bannerImages[bannerIndex];

        }, 2000);
    }

});