/* RICERCA INPUT*/
const searchInput = document.querySelector(".search-input");
const container = document.querySelector("#moviesGrid");

// dati di prova per fetch
let movies = [
  {
    title: "Jurassic World",
    posterUrl: "img/jurassicworld_poster.webp"
  },
  {
    title: "Avatar",
    posterUrl: "img/avatar2_poster.png"
  },
  {
    title: "Dune",
    posterUrl: "img/dune-prossimamente.jpg"
  },
  {
    title: "Dragon Trainer",
    posterUrl: "img/dragontrainer_poster.jpg"
  },
  {
    title: "Superman",
    posterUrl: "img/superman.jpg"
  },
  {
    title: "Lilo & Stitch",
    posterUrl: "img/lilo_poster.jpg"
  },
  {
    title: "Mandalorian and Grogu",
    posterUrl: "img/mandalorian_grogu_poster.jpg"
  },
  {
    title: "Final Destination",
    posterUrl: "img/final destination_poster.jpg"
  },
  {
    title: "Scream 7",
    posterUrl: "img/scream7_poster.jpg"
  }
];

let genere = [

];

renderMovies(movies);

// =========================
// 🎬 RENDER FUNCTION
// =========================
function renderMovies(list) {
  container.innerHTML = "";

  list.forEach(movie => {
    const col = document.createElement("div");
    col.className = "col-6 col-md-4";

    col.innerHTML = `
      <div class="movie-card">
        <img src="${movie.posterUrl}" alt="${movie.title}">
        <h2>${movie.title}</h2>
      </div>
    `;

    container.appendChild(col);
  });
}

// =========================
// 🔍 LIVE SEARCH (case insensitive)
// =========================
searchInput.addEventListener("input", (e) => {
  const value = e.target.value.toLowerCase().trim();

  // se vuoto → reset
  if (value === "") {
    renderMovies(movies);
    return;
  }

  const filtered = movies.filter(movie =>
    movie.title.toLowerCase().includes(value)
  );

  renderMovies(filtered);
});