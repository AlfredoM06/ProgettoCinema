document.addEventListener("DOMContentLoaded", () => {


  let rows = 12;
  let seatsPerRow = 14;


  let seatContainer = document.getElementById("seats");
  let seatCountEl = document.getElementById("seat-count");

  let selectionBox = document.getElementById("selection-info");
  let promoBox = document.getElementById("promo-box");
  promoBox.classList.add("hidden");

  let totalTicketsEl = document.getElementById("total-tickets");
  let totalPriceEl = document.getElementById("total-price");


  let minusBtn = document.getElementById("minus");
  let plusBtn = document.getElementById("plus");


  let ticketCount = 1;

  let selectedSeats = [];

  let selectionStarted = false;



  /*
  =========================
      TIPI POSTO
  =========================
  */

  let getSeatType = (rowIndex) => {
    if (rowIndex < 2) return "green";
    if (rowIndex < 5) return "blue";
    if (rowIndex < 8) return "red";

    return "vip";

  };



  /*
  =========================
      PREZZI
  =========================
  */

  let getPrice = (seat) => {

    if (seat.classList.contains("vip"))
      return 9.7;

    if (seat.classList.contains("red"))
      return 7.7;

    if (seat.classList.contains("blue"))
      return 6.7;

    if (seat.classList.contains("green"))
      return 5.7;

    return 0;

  };

  /*
    =========================
        GESTIONE CLICK
    =========================
    */
  const handleSeatClick = (seat) => {

    if (seat.classList.contains("occupied"))
      return;

    selectionStarted = true;

    let index = selectedSeats.indexOf(seat);



    // =========================
    // DESELEZIONE STESSO POSTO
    // =========================

    if (index !== -1) {

      seat.classList.remove("selected");

      selectedSeats.splice(index, 1);

    }



    // =========================
    // NUOVO POSTO
    // =========================

    else {


      // CASO 1 POSTO
      // sostituisce il precedente

      if (ticketCount === 1) {
        selectedSeats.forEach(oldSeat => {
          oldSeat.classList.remove("selected");
        });

        selectedSeats = [];

        seat.classList.add("selected");
        selectedSeats.push(seat);

      } else {

        if (selectedSeats.length >= ticketCount) {

          let firstSeat = selectedSeats.shift();
          firstSeat.classList.remove("selected");
        }


        seat.classList.add("selected");
        selectedSeats.push(seat);
      }

    }


    updateUI();

  };


  /*
  =========================
      GENERAZIONE POSTI
  =========================
  */


  for (let i = 0; i < rows; i++) {

    let rowWrapper = document.createElement("div");
    rowWrapper.classList.add("row-wrapper");

    let label = document.createElement("div");
    label.classList.add("row-label");
    label.innerText = String.fromCharCode(65 + i);


    let row = document.createElement("div");
    row.classList.add("row-seats");

    for (let j = 0; j < seatsPerRow; j++) {

      let seat = document.createElement("div");

      seat.classList.add(
        "seat",
        getSeatType(i)
      );

      // posizione posto
      seat.dataset.position =
        `${String.fromCharCode(65 + i)}${j + 1}`;

      if (Math.random() < 0.2) {
        seat.classList.add("occupied");
      }

      seat.addEventListener("click", () => {
        handleSeatClick(seat);
      });

      row.appendChild(seat);

    }

    rowWrapper.append(label, row);
    seatContainer.appendChild(rowWrapper);

  }


  /*
  =========================
      FILTRO LEGGENDA
  =========================
  */

  let legendButtons = document.querySelectorAll(".legend-btn");
  let activeFilter = null;

  legendButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      let type = btn.dataset.type;

      if (activeFilter === type) {
        activeFilter = null;

        document.querySelectorAll(".seat")
          .forEach(seat => {
            seat.classList.remove("dimmed");
          });

        legendButtons.forEach(b =>
          b.classList.remove("active")
        );

        return;

      }

      activeFilter = type;

      legendButtons.forEach(b =>
        b.classList.remove("active")
      );

      btn.classList.add("active");


      document.querySelectorAll(".seat")
        .forEach(seat => {


          seat.classList.toggle(
            "dimmed",
            !seat.classList.contains(type)
          );


        });



    });


  });


  /*
  =========================
      AGGIORNA INTERFACCIA
  =========================
  */

  let updateUI = () => {
    seatCountEl.textContent = ticketCount;
    if (selectedSeats.length > 0) {

      selectionBox.classList.remove("hidden");
      promoBox.classList.remove("hidden");

    } else {

      selectionBox.classList.add("hidden");

      if (selectionStarted) {
        promoBox.classList.remove("hidden");
      }

    }

    document.querySelector(".checkout-box").classList.toggle("hidden", selectedSeats.length === 0);

    minusBtn.classList.toggle(
      "disabled",
      ticketCount === 1
    );


    totalTicketsEl.textContent = selectedSeats.length;
    let total = selectedSeats.reduce((sum, seat) => sum + getPrice(seat), 0);
    totalPriceEl.textContent = total.toFixed(2);

    updateSummary();

  };


  /*
  =========================
      BOTTONI + -
  =========================
  */


  plusBtn.addEventListener("click", () => {
    ticketCount++;
    updateUI();
  });


  minusBtn.addEventListener("click", () => {

    if (ticketCount === 1)
      return;


    ticketCount--;



    // elimina gli ultimi posti selezionati

    while (selectedSeats.length > ticketCount) {
      let lastSeat = selectedSeats.pop();
      lastSeat.classList.remove("selected");
    }

    updateUI();

  });



  /*
  =========================
      SUMMARY
  =========================
  */


  function updateSummary() {

    let summary = document.getElementById("selected-summary");

    if (selectedSeats.length === 0) {
      summary.innerHTML = "";
      summary.classList.add("hidden");
      return;
    }

    summary.classList.remove("hidden");
    summary.innerHTML = "";


    /*
  =========================
      LISTA POSTI
  =========================
  */


    let seatsList = document.createElement("div");

    seatsList.classList.add(
      "selected-seats-list"
    );


    selectedSeats.forEach(seat => {


      let type =
        [...seat.classList]
          .find(c =>
            [
              "vip",
              "red",
              "blue",
              "green"
            ].includes(c)
          );


      let seatItem = document.createElement("div");

      seatItem.classList.add(
        "summary-seat-wrapper"
      );


      seatItem.innerHTML = `

      <div class="summary-seat ${type}">
      </div>

      <div class="summary-text">
        ${seat.dataset.position}
      </div>

    `;


      seatsList.appendChild(seatItem);


    });


    summary.appendChild(seatsList);



    /*
    =========================
        RIEPILOGO CATEGORIE
    =========================
    */


    let groups = {};


    selectedSeats.forEach(seat => {


      let type =
        [...seat.classList]
          .find(c =>
            [
              "vip",
              "red",
              "blue",
              "green"
            ].includes(c)
          );


      if (!groups[type]) {
        groups[type] = {

          count: 0,
          total: 0

        };
      }

      groups[type].count++;
      groups[type].total += getPrice(seat);

    });



    Object.keys(groups)
      .forEach(type => {
        let categoryWrapper = document.createElement("div");

        categoryWrapper.classList.add(
          "summary-category"
        );


        let row = document.createElement("div");

        row.classList.add(
          "summary-row"
        );

        row.innerHTML = `
        <div class="summary-row">
        <div class="summary-left">
          <div class="summary-text">

            ${groups[type].count}
            x Biglietto online
            ${capitalize(type)}

          </div>
        </div>


        <div class="summary-price">
          ${groups[type].total.toFixed(2)} €
        </div>
        </div>

      `;
        categoryWrapper.appendChild(row);
        summary.appendChild(categoryWrapper);


      });


  }

  let capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);

  };


  /*
  =========================
      TIMER
  =========================
  */


  let time = 300;

  setInterval(() => {

    let minutes = Math.floor(time / 60);
    let seconds = time % 60;

    document.getElementById("timer").textContent = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

    if (time > 0)
      time--;

  }, 1000);


  /*
  =========================
      INIT
  =========================
  */

  updateUI();



});