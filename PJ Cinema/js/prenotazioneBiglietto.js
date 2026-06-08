document.addEventListener("DOMContentLoaded", () => {

  const rows = 12;
  const seatsPerRow = 14;

  const seatContainer = document.getElementById("seats");
  const seatCountEl = document.getElementById("seat-count");
  const selectionBox = document.getElementById("selection-info");
  const totalTicketsEl = document.getElementById("total-tickets");
  const totalPriceEl = document.getElementById("total-price");

  const minusBtn = document.getElementById("minus");
  const plusBtn = document.getElementById("plus");

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

  // 🔽 ciclo posti
  for (let j = 0; j < seatsPerRow; j++) {

    const seat = document.createElement("div");
    seat.classList.add("seat", getSeatType(i));

    // posti occupati random
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
  // SELEZIONE POSTI
  // =========================
  function updateSelectedSeats() {
    const allSelected = document.querySelectorAll(".seat.selected");
    selectedSeats = Array.from(allSelected);
  }

  // =========================
  // UI UPDATE
  // =========================
  function updateUI() {

    seatCountEl.innerText = ticketCount;

    const hasSelection = selectedSeats.length > 0;

    // selection box
    if (hasSelection) {
      selectionBox.classList.remove("hidden");
    } else {
      selectionBox.classList.add("hidden");
    }

    // checkout box (🔥 NUOVO)
    const checkoutBox = document.querySelector(".checkout-box");

    if (hasSelection) {
      checkoutBox.classList.remove("hidden");
    } else {
      checkoutBox.classList.add("hidden");
    }

    // totale biglietti
    totalTicketsEl.innerText = selectedSeats.length;

    // prezzo
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
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    document.getElementById("timer").innerText =
      `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

    if (time > 0) time--;
  }, 1000);

  // =========================
  // INIT
  // =========================
  updateUI();

});