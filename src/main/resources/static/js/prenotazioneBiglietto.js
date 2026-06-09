document.addEventListener("DOMContentLoaded", () => {

  let rows = 12;
  let seatsPerRow = 14;

  let seatContainer = document.getElementById("seats");
  let seatCountEl = document.getElementById("seat-count");
  let selectionBox = document.getElementById("selection-info");
  let totalTicketsEl = document.getElementById("total-tickets");
  let totalPriceEl = document.getElementById("total-price");

  let minusBtn = document.getElementById("minus");
  let plusBtn = document.getElementById("plus");

  let ticketCount = 1;
  let selectedSeats = [];

  // =========================
  // TIPI POSTO
  // =========================
  function getSeatType(rowIndex) {
    if (rowIndex < 2) return "green";
    if (rowIndex < 5) return "blue";
    if (rowIndex < 8) return "red";
    return "vip";
  }

  // =========================
  // PREZZI
  // =========================
  function getPrice(seat) {
    if (seat.classList.contains("vip")) return 9.7;
    if (seat.classList.contains("red")) return 7.7;
    if (seat.classList.contains("blue")) return 6.7;
    if (seat.classList.contains("green")) return 5.7;
    return 0;
  }

  // =========================
  // GENERAZIONE POSTI
  // =========================
  for (let i = 0; i < rows; i++) {

    const rowWrapper = document.createElement("div");
    rowWrapper.classList.add("row-wrapper");

    const label = document.createElement("div");
    label.classList.add("row-label");
    label.innerText = String.fromCharCode(65 + i);

    const row = document.createElement("div");
    row.classList.add("row-seats");

    for (let j = 0; j < seatsPerRow; j++) {

      const seat = document.createElement("div");
      seat.classList.add("seat", getSeatType(i));

      if (Math.random() < 0.2) {
        seat.classList.add("occupied");
      }

      seat.addEventListener("click", () => {
        if (seat.classList.contains("occupied")) return;

        seat.classList.toggle("selected");

        updateSelectedSeats();
        updateUI();
      });

      row.appendChild(seat);
    }

    rowWrapper.appendChild(label);
    rowWrapper.appendChild(row);
    seatContainer.appendChild(rowWrapper);
  }

  // =========================
  // 🎬 FILTRO CATEGORIE (QUI 👇)
  // =========================
  const legendButtons = document.querySelectorAll(".legend-btn");
  let activeFilter = null;

  legendButtons.forEach(btn => {

    btn.addEventListener("click", () => {

      let type = btn.dataset.type;

      if (activeFilter === type) {
        activeFilter = null;

        document.querySelectorAll(".seat").forEach(seat => {
          seat.classList.remove("dimmed");
        });

        legendButtons.forEach(b => b.classList.remove("active"));
        return;
      }

      activeFilter = type;

      legendButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      document.querySelectorAll(".seat").forEach(seat => {

        if (seat.classList.contains(type)) {
          seat.classList.remove("dimmed");
        } else {
          seat.classList.add("dimmed");
        }

      });

    });

  });

  // =========================
  // SELEZIONE POSTI
  // =========================
  function updateSelectedSeats() {
    let allSelected = document.querySelectorAll(".seat.selected");
    selectedSeats = Array.from(allSelected);
  }

  // =========================
  // UI UPDATE
  // =========================
  function updateUI() {

    seatCountEl.innerText = ticketCount;

    let hasSelection = selectedSeats.length > 0;

    if (hasSelection) {
      selectionBox.classList.remove("hidden");
    } else {
      selectionBox.classList.add("hidden");
    }

    let checkoutBox = document.querySelector(".checkout-box");

    if (hasSelection) {
      checkoutBox.classList.remove("hidden");
    } else {
      checkoutBox.classList.add("hidden");
    }

    totalTicketsEl.innerText = selectedSeats.length;

    let total = 0;
    selectedSeats.forEach(seat => {
      total += getPrice(seat);
    });

    totalPriceEl.innerText = total.toFixed(2);
  }

  // =========================
  // BOTTONI + / -
  // =========================
  plusBtn.addEventListener("click", () => {
    ticketCount++;
    updateUI();
  });

  minusBtn.addEventListener("click", () => {
    if (ticketCount > 1) ticketCount--;
    updateUI();
  });

  // =========================
  // TIMER
  // =========================
  let time = 300;

  setInterval(() => {
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;

    document.getElementById("timer").innerText =
      `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

    if (time > 0) time--;
  }, 1000);

  // =========================
  // INIT
  // =========================
  updateUI();

});