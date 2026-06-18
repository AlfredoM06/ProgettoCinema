// SCROLL FRECCIA HERO
document.getElementById("scrollDown").addEventListener("click", () => {
  document.getElementById("main").scrollIntoView({ behavior: "smooth" });
});

// FLIP CARDS
document.querySelectorAll(".card-flip").forEach(card => {

  const frontBtn = card.querySelector(".flip-btn");
  const backBtn = card.querySelector(".flip-back");

  frontBtn.addEventListener("click", () => {

    // chiudi tutte le altre
    document.querySelectorAll(".card-flip").forEach(c => {
      c.classList.remove("flipped");
    });

    // apri solo questa
    card.classList.add("flipped");
  });

  backBtn.addEventListener("click", (e) => {
    e.preventDefault();
    card.classList.remove("flipped");
  });

});