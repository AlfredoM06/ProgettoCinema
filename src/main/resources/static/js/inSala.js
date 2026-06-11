//let searchInput = document.getElementById("searchInput");
//let genreSelect = document.getElementById("genreSelect");
//let allCards   = document.querySelectorAll(".movie-item");

// =========================
// 🔍 Funzione filtro
// =========================
//function filterMovies() {
//  let keyword = searchInput.value.toLowerCase().trim();
//  let genre   = genreSelect.value.toLowerCase();
//
//  allCards.forEach(card => {
//    let title      = card.dataset.title.toLowerCase();
//    let cardGenre  = card.dataset.genere || "";
//
//    let matchTitle  = title.includes(keyword);
//    let matchGenre  = genre === "all" || cardGenre === genre;
//
//    card.style.display = (matchTitle && matchGenre) ? "" : "none";
//  });
//}

// =========================
// 🎧 Event listeners
// =========================
//searchInput.addEventListener("input",  filterMovies);
//genreSelect.addEventListener("change", filterMovies);