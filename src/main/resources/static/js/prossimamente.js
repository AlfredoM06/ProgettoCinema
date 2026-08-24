document.addEventListener("DOMContentLoaded", () => {

    // ======================================================
    // CARDS
    // ======================================================

    let cards = document.querySelectorAll(".filmCard");
    let moviePage = document.createElement("div");
    moviePage.classList.add("movie-page");
    document.body.appendChild(moviePage);
    let descStarted = false;
    let isClosing = false;


    // ======================================================
    // FORMATTA DURATA
    // ======================================================

    function formatDuration(minutes) {

        if (!minutes) {
            return "";
        }

        minutes = parseInt(minutes);

        if (isNaN(minutes)) {
            return "";
        }

        let hours = Math.floor(minutes / 60);
        let mins = minutes % 60;

        if (hours > 0 && mins > 0) {
            return `${hours}h ${mins}m`;
        }

        if (hours > 0) {
            return `${hours}h`;
        }
        return `${mins}m`;
    }


    // ======================================================
    // FORMATTA DATA
    // GG/MM/ANNO
    // ======================================================

    function formatDate(dateValue) {

        if (!dateValue) {
            return "";
        }

        let date = new Date(dateValue);

        if (isNaN(date.getTime())) {
            return "";
        }

        let day = String(date.getDate()).padStart(2, "0");
        let month = String(date.getMonth() + 1).padStart(2, "0");
        let year = date.getFullYear();

        return `${day}/${month}/${year}`;
    }


    // ======================================================
    // GESTIONE VALORI MULTIPLI
    // ======================================================

    function formatMultiple(value) {
        if (!value) {
            return "";
        }
        return value
            .split(/[;,]/)
            .map(item => item.trim())
            .filter(item => item.length > 0)
            .join(", ");
    }


    // INFO
    function triggerInfoAndButtons() {
        moviePage.querySelectorAll(".info li").forEach((el, i) => {
            setTimeout(() => {
                el.classList.add("show");
                el.querySelectorAll("button").forEach(btn => {
                    btn.classList.add("show");
                });
            }, i * 150);
        });
    }

    // ACTION BUTTON
    function triggerButtons() {

        let btn = moviePage.querySelector(".btn-slice");

        if (btn) {

            setTimeout(() => {
                btn.classList.add("show");
            }, 200);

        }
    }


    // ======================================================
    // CLOSE X
    // ======================================================

    function triggerClose() {
        let close = moviePage.querySelector(".movie-close");

        if (!close) {
            return;
        }
        setTimeout(() => {
            close.classList.add("show");
        }, 150);
    }


    // ======================================================
    // DESCRIZIONE
    // ======================================================
    function animateDescriptionLines(container, text) {
        container.innerHTML = "";

        if (!text) {
            triggerInfoAndButtons();
            triggerButtons();
            triggerClose();
            return;
        }

        let words = text.split(" ");
        let measure = document.createElement("span");
        measure.style.visibility = "hidden";
        measure.style.position = "absolute";
        measure.style.whiteSpace = "nowrap";
        document.body.appendChild(measure);
        let lineText = "";
        let lines = [];

        words.forEach(word => {
            let testText = lineText + word + " ";
            measure.textContent = testText;
            if (measure.offsetWidth > container.offsetWidth) {
                lines.push(lineText.trim());
                lineText = word + " ";
            } else {
                lineText = testText;
            }
        });

        if (lineText) {
            lines.push(lineText.trim());
        }

        document.body.removeChild(measure);
        let triggerPoint = Math.floor(lines.length * 0.5);
        descStarted = false;

        lines.forEach((line, i) => {
            let span = document.createElement("span");
            span.classList.add("desc-line");
            span.textContent = line;
            container.appendChild(span);

            setTimeout(() => {
                span.classList.add("show");
                if (!descStarted && i >= triggerPoint) {
                    descStarted = true;
                    triggerInfoAndButtons();
                    triggerButtons();
                    triggerClose();
                }
            }, i * 140);
        });
    }


    // ======================================================
    // OPEN MOVIE
    // ======================================================

    function openMovie(filmCard) {
        document.body.classList.add("no-navbar");
        moviePage.classList.remove("active");
        isClosing = false;


        // DATI FILM
        let title = filmCard.dataset.title || "";
        let desc = filmCard.dataset.desc || "";
        let img = filmCard.dataset.img || "";
        let cast = formatMultiple(filmCard.dataset.cast);
        let regia = formatMultiple( filmCard.dataset.regia);
        let durata = formatDuration(filmCard.dataset.durata);
        let data = formatDate(filmCard.dataset.data);

        // HTML
        moviePage.innerHTML = `
            <div class="hero"
                 style="background-image: url('${img}')">
            </div>
            <div class="movie-close">
                ×
            </div>
            <main class="movie-layout">
                <section class="left">
                    <div class="top">
                        <h1 class="title"></h1>
                    </div>
                    <ul class="info">
                        <li>
                            <span>Cast</span>
                            <button>${cast}</button>
                        </li>
                        <li>
                            <span>Regia</span>
                            <button>${regia}</button>
                        </li>
                        <li>
                            <span>Durata</span>
                            <button>${durata}</button>
                        </li>
                        <li>
                            <span>Data</span>
                            <button>${data}</button>
                        </li>
                    </ul>
                </section>

                <section class="right">
                    <div class="desc-box"></div>
                    <div class="actions">
                        <a href="#" class="btn-slice">
                            <div class="top">
                                <span>Prenota ora!</span>
                            </div>
                            <div class="bottom">
                                <span>Prenota ora!</span>
                            </div>
                        </a>
                    </div>
                </section>
            </main>
        `;

        // APERTURA
        requestAnimationFrame(() => {
            moviePage.classList.add("active");
        });

        let titleEl = moviePage.querySelector(".title");
        let descBox = moviePage.querySelector(".desc-box");

        // TITLE
        titleEl.innerHTML = "";
        let lines = title.split(":");
        lines.forEach((line, lineIndex) => {
            let row = document.createElement("div");
            row.classList.add("title-line");
            let text =
                line.trim() + (lineIndex === 0 &&lines.length > 1? ":": "");

            let words = text.split(" ");
            words.forEach((word, wordIndex) => {
                let wordEl = document.createElement("span");
                wordEl.classList.add("word");
                [...word].forEach((char, charIndex) => {
                    let letter = document.createElement("span");
                    letter.textContent =
                        char === " " ? "\u00A0" : char;

                    letter.style.animationDelay =
                        `${(lineIndex * 0.1) +
                          (wordIndex * 0.15) +
                          (charIndex * 0.03)}s`;

                    wordEl.appendChild(letter);
                });
                row.appendChild(wordEl);
            });
            titleEl.appendChild(row);
        });


        // DESCRIZIONE
        let titleDuration = title.length * 25;

        setTimeout(() => {
            animateDescriptionLines(
                descBox,
                desc
            );
        }, titleDuration + 250);


        // ==================================================
        // CLOSE
        // ==================================================
        moviePage
            .querySelector(".movie-close")
            .addEventListener("click", closeMovie);
    }


    // ======================================================
    // CLOSE MOVIE
    // ======================================================

    function closeMovie() {
        if (isClosing) {
            return;
        }

        isClosing = true;

        moviePage.classList.add("closing");
        moviePage.classList.remove("active");


        setTimeout(() => {
            moviePage.innerHTML = "";
            moviePage.classList.remove("closing");
            document.body.classList.remove("no-navbar");
            isClosing = false;
        }, 800);
    }


    // EVENTI CARD

    cards.forEach(filmCard => {
        filmCard.addEventListener("click", () => {
            openMovie(filmCard);
        });

    });

});