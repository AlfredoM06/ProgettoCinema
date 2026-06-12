//let searchInput = document.querySelector("#searchInput");
//let genreSelect = document.querySelector("#genreSelect");
//let container = document.querySelector("#moviesGrid");
//
//const BASE_URL = "url qualcosa";
//
//let timeout = null;
//
//// =========================
//// 🔥 FETCH HTML DAL BACKEND
//// =========================
//async function fetchMovies() {
//  let keyword = searchInput.value.trim();
//  let genere = genreSelect.value;
//
//  let params = new URLSearchParams();
//
//  if (keyword) params.append("keyword", keyword);
//  if (genere && genere !== "all") params.append("genere", genere);
//
//  const url = `${BASE_URL}?${params.toString()}`;
//
//  try {
//    const res = await fetch(url);
//    const html = await res.text();
//
//    const parser = new DOMParser();
//    const doc = parser.parseFromString(html, "text/html");
//
//    const newGrid = doc.querySelector("#moviesGrid");
//
//    container.innerHTML = newGrid.innerHTML;
//
//  } catch (err) {
//    console.error("Errore fetch film:", err);
//  }
//}
//
//// typing con debounce
//searchInput.addEventListener("input", () => {
//  clearTimeout(timeout);
//
//  timeout = setTimeout(() => {
//    fetchMovies();
//  }, 400);
//});
//
//// cambio genere immediato
//genreSelect.addEventListener("change", () => {
//  fetchMovies();
//});