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