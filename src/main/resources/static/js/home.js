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