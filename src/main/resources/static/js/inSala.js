let searchInput = document.querySelector("#searchInput");
let genreSelect = document.querySelector("#genreSelect");
let container = document.querySelector("#moviesGrid");

const BASE_URL_FILM = "/inSala/ricerca";
const BASE_URL_GENRE = "/inSala/generi";

let timeout = null;

// =========================
// CARICAMENTO FILM
// =========================
function fetchMovies() {
    let keyword = searchInput.value.trim();
    let genere = genreSelect.value;

    let params = new URLSearchParams();

    if (keyword) params.append("keyword", keyword);
    if (genere && genere !== "all") params.append("genere", genere);

    let url = BASE_URL_FILM + "?" + params.toString();

    fetch(url)
        .then(response => response.json())
        .then(films => {

            container.innerHTML = "";

            if (!films || films.length === 0) {
                container.innerHTML = `
                    <p class="text-center text-secondary mt-4">
                        Nessun film trovato.
                    </p>
                `;
                return;
            }

            films.forEach(film => {
                container.innerHTML += `
                    <div class="col-6 col-md-4 movie-item">
                        <a href="/inSala/dettagli/${film.id}" class="movie-card-link">
                            <div class="movie-card">
                                <img src="${film.img_poster}" alt="${film.titolo}">
                                <h2>${film.titolo}</h2>
                            </div>
                        </a>
                    </div>
                `;
            });

        })
        .catch(err => {
            console.log("Errore caricamento film:", err);
        });
}

// =========================
// CARICAMENTO GENERI
// =========================
function fetchGenres() {

    fetch(BASE_URL_GENRE)
        .then(response => response.json())
        .then(genres => {

            genreSelect.innerHTML = `<option value="all">Generi</option>`;

            genres.forEach(g => {
                genreSelect.innerHTML += `
                    <option value="${g.id}">
                        ${g.nome}
                    </option>
                `;
            });

        })
        .catch(err => {
            console.log("Errore caricamento generi:", err);
        });
}

// =========================
// EVENTI INPUT
// =========================
searchInput.addEventListener("input", function () {

    clearTimeout(timeout);

    timeout = setTimeout(function () {
        fetchMovies();
    }, 300);

});

genreSelect.addEventListener("change", function () {
    fetchMovies();
});

// =========================
// INIT
// =========================
fetchGenres();
fetchMovies();