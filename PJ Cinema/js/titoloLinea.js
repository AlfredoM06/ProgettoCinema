let titoli = document.querySelectorAll(".titoloLinea");

let observer = new IntersectionObserver((entries) => {
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