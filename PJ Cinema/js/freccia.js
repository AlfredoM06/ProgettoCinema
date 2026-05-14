const freccia = document.querySelector(".freccia");

window.addEventListener("scroll", () => {
  const metàPagina = document.body.scrollHeight / 6;
  
  if (window.scrollY > metàPagina) {
    freccia.classList.add("show");
  } else {
    freccia.classList.remove("show");
  }
});