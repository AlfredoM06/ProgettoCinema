document.querySelectorAll('.filter-radio').forEach(radio => {
  radio.addEventListener('change', function () {

    const value = this.value;
    const cards = document.querySelectorAll('.card-item');

    cards.forEach(card => {

      const type = card.getAttribute('data-type');

      if (value === 'all' || value === type) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }

    });

  });
});
