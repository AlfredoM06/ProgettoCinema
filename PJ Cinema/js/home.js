const cards = document.querySelectorAll('.card');
const overlay = document.querySelector('.global-overlay');

cards.forEach(card => {
  card.addEventListener('mouseenter', () => {
    overlay.style.opacity = '1';
  });

  card.addEventListener('mouseleave', () => {
    overlay.style.opacity = '0';
  });
});

const titoli = document.querySelectorAll(".titoloLinea");

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("active");
    }
  });
}, {
  threshold: 0.5
});

titoli.forEach(titolo => {
  observer.observe(titolo);
});