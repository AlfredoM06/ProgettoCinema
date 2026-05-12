// Seleziono tutte le card
const cards = document.querySelectorAll('.card');

// Creo una sola movie page globale
const moviePage = document.createElement('div');
moviePage.classList.add('movie-page');
document.body.appendChild(moviePage);

// Funzione per aprire la movie page
function openMovie(card) {
  const title = card.dataset.title;
  const desc = card.dataset.desc;
  const img = card.dataset.img;

  moviePage.innerHTML = `
    <div class="hero" style="background-image: url('${img}')"></div>
    <div class="content">
      <h1>${title}</h1>
      <p>${desc}</p>
      <button class="close-btn">Chiudi</button>
    </div>
  `;

  // Mostra la pagina film
  moviePage.classList.add('active');

  // Pulsante chiudi
  moviePage.querySelector('.close-btn').addEventListener('click', () => {
    moviePage.classList.remove('active');
  });
}

// Aggiungo click listener a tutte le card
cards.forEach(card => {
  card.addEventListener('click', () => openMovie(card));
});