document.addEventListener("DOMContentLoaded", () => {
  const BASE_URL_GET = "/inSala/salaAcquisto";
  const BASE_URL_POST = "/biglietto/acquistoBiglietto";

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

  let time = 300;
  let sessionExpired = false;
  let timerInterval;


  /*
   =========================
       oggetto immagini
   =========================
   */
  const seatImages = {
    vip: {
      available: "/img/vip_prenotabile.svg",
      selected: "/img/vip_riservato.svg",
      occupied: "/img/vip_soldout.svg"
    },
    green: {
      available: "/img/verde_prenotabile.svg",
      selected: "/img/verde_riservato.svg",
      occupied: "/img/verde_soldout.svg"
    },
    disabled: {
      available: "/img/disabili_prenotabile.svg",
      selected: "/img/disabili_riservato.svg",
      occupied: "/img/disabili_soldout.svg"
    }
  };

  /*
==================================
   PREZZI+ TIPO POSTI + LEGGENDA
==================================
*/

  //// CONVERSIONE x i prezzi (Standard,V.I.P.,Disabili)
  function mapTipoPrezzo(tipoBackend) {
    switch (tipoBackend) {
      case "Standard":
        return "green";
      case "V.I.P.":
        return "vip";
      case "Disabili":
        return "disabled";
      default:
        return null;
    }
  }
  // CONVERSIONE X POSTI della sala (tipo 1,2,3)
  function mapTipoPosto(tipoNumero) {
    switch (tipoNumero) {
      case 1:
        return "green";
      case 2:
        return "vip";
      case 3:
        return "disabled";
      default:
        return null;
    }
  }

  let PREZZI = {};

  function caricaPrezzi() {
    POSTI.forEach(posto => {
      let tipo = mapTipoPrezzo(posto.tipo);
      if (tipo && PREZZI[tipo] === undefined) {
        PREZZI[tipo] = posto.prezzoPosto;
      }
    });
  }


  function getPrice(seat) {
    let type = seat.dataset.type;
    return PREZZI[type] ?? 0;
  }


  function aggiornaPrezziLegenda() {
    document.querySelectorAll(".legend-btn").forEach(btn => {
      let type = btn.dataset.type;
      let priceElement = btn.querySelector(".legend-price");

      if (PREZZI[type] !== undefined) {
        priceElement.textContent =
          PREZZI[type].toFixed(2) + "€";
      }
    });
  }

  //REVERSE PER L'ACQUISTO
  function reverseTipo(type) {

    switch (type) {
      case "green":
        return "Standard";
      case "vip":
        return "V.I.P.";
      case "disabled":
        return "Disabili";
      default:
        return null;
    }
  }


  /*
  =========================
      POSTI
  =========================
  */

  //  POSIZIONE X VISUALIZZAZIONE
  function mapPosizioneVisuale(posizione) {

    let parti = posizione.split("_");
    let riga = parseInt(parti[0]);
    let numeroPosto = parti[1];
    let lettera = String.fromCharCode(65 + riga);

    return `${lettera}${numeroPosto}`;
  }

  // REVERSE POSIZIONE X ACQUISTO
  function reversePosizione(posizione) {

    let lettera = posizione.charAt(0);
    let numeroPosto = posizione.substring(1);
    let riga = lettera.charCodeAt(0) - 65;
    return `${riga}_${numeroPosto}`;
  }

  function loadPosti(idSala) {

    console.log("Parametro ricevuto da loadPosti:", idSala);

    fetch(`${BASE_URL_GET}/${idSala}`)
      .then(res => {
        if (!res.ok)
          throw new Error("Errore caricamento posti");

        return res.json();
      })
      .then(data => {
        console.log("DATI SALA:", data);
        renderPosti(data);
      })
      .catch(err => console.error(err));

  }

  /*
    =========================
        GESTIONE CLICK
    =========================
    */
  const handleSeatClick = (seat) => {

    if (seat.classList.contains("occupied"))
      return;

    if (seat.classList.contains("dimmed") && !seat.classList.contains("selected"))
      return;

    selectionStarted = true;

    let index = selectedSeats.indexOf(seat);

    /*DESELEZIONE STESSO POSTO*/

    if (index !== -1) {

      let img = seat.querySelector("img");
      let type = seat.dataset.type;
      img.src = seatImages[type].available;
      seat.classList.remove("selected");

      selectedSeats.splice(index, 1);

    }

    /*NUOVO POSTO*/

    else {


      // CASO 1 POSTO
      // sostituisce il precedente

      if (ticketCount === 1) {

        selectedSeats.forEach(oldSeat => {
          let oldImg = oldSeat.querySelector("img");
          let oldType = oldSeat.dataset.type;

          oldImg.src = seatImages[oldType].available; // 🔥 fondamentale
          oldSeat.classList.remove("selected");
        });

        selectedSeats = [];

        let img = seat.querySelector("img");
        let type = seat.dataset.type;

        img.src = seatImages[type].selected;

        seat.classList.add("selected");
        selectedSeats.push(seat);
      } else {

        if (selectedSeats.length >= ticketCount) {

          let firstSeat = selectedSeats.shift();

          let firstImg = firstSeat.querySelector("img");
          let firstType = firstSeat.dataset.type;

          firstImg.src = seatImages[firstType].available;
          firstSeat.classList.remove("selected");
        }

        let img = seat.querySelector("img");
        let type = seat.dataset.type;

        img.src = seatImages[type].selected;

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

  function renderPosti(matrice) {

    seatContainer.innerHTML = "";

    for (let i = 0; i < matrice.length; i++) {

      let rowWrapper = document.createElement("div");
      rowWrapper.classList.add("row-wrapper");


      let label = document.createElement("div");
      label.classList.add("row-label");
      label.innerText = String.fromCharCode(65 + i);


      let row = document.createElement("div");
      row.classList.add("row-seats");


      for (let j = 0; j < matrice[i].length; j++) {

        let posto = matrice[i][j];


        // posto vuoto
        if (posto.tipo === 0) {

          let empty = document.createElement("div");
          empty.classList.add("seat", "empty");
          row.appendChild(empty);

          continue;
        }


        let seat = document.createElement("div");
        seat.classList.add("seat");


        let type = mapTipoPosto(posto.tipo);

        if (type === null) {
          console.log("TIPO NON GESTITO:", posto.tipo);
          continue;
        }


        seat.dataset.type = type;

        // usa l'id reale
        seat.dataset.position = posto.id;
        seat.dataset.positionView = mapPosizioneVisuale(posto.id);


        let img = document.createElement("img");


        if (posto.occupato) {

          seat.classList.add("occupied");
          img.src = seatImages[type].occupied;

        } else {

          img.src = seatImages[type].available;

        }


        seat.appendChild(img);


        seat.addEventListener("click", () => {
          handleSeatClick(seat);
        });


        row.appendChild(seat);

      }


      rowWrapper.append(label, row);
      seatContainer.appendChild(rowWrapper);

    }
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
            seat.dataset.type !== type
          );


        });



    });


  });



  /*
  =========================
      POST ACQUISTO
  =========================
  */

  function acquistaBiglietto() {

    let listaPostiDTO = selectedSeats.map(seat => ({
      id: reversePosizione(seat.dataset.positionView),
      tipo: reverseTipo(seat.dataset.type)
    }));

    fetch(BASE_URL_POST, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        id_film: FILM_ID,
        id_utente: USER_ID,
        id_programmazione: ID_PROGRAMMAZIONE,
        listaPostiDTO: listaPostiDTO,
        acquisto: true
      })
    })
      .then(res => {
        if (!res.ok)
          throw new Error("Errore acquisto");
        return res.json();
      })
      .then(scontrino => {

        console.log("Scontrino:", scontrino);

        // sicurezza base
        if (!scontrino || scontrino.success === false) {
          alert("Errore durante l'acquisto");
          return;
        }

        // reset dati
        selectedSeats = [];

        updateUI();

        // NASCONDI tutto il contenuto cinema
        document
          .getElementById("main-content")
          .classList.add("hidden");

        // MOSTRA messaggio
        document
          .getElementById("success-message")
          .classList.remove("hidden");

        // redirect dopo 2 secondi
        setTimeout(() => {
          window.location.href = "/";
        }, 2000);

      })
      .catch(err => {
        console.error(err);
      });
  }

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

  //RIPRISTINO SESSIONE ALLO SCADERE DEL TEMPO
  function ripristinaSessione() {

    selectedSeats.forEach(seat => {
      let img = seat.querySelector("img");
      let type = seat.dataset.type;

      img.src = seatImages[type].available;
      seat.classList.remove("selected");
    });

    selectedSeats = [];
    updateUI();

    // aggiorna la sala (controlla eventuali acquisti fatti nel frattempo)
    loadPosti(ID_SALA);

    // chiude modal
    let modalElement = document.getElementById("sessionExpiredModal");
    let modal = bootstrap.Modal.getInstance(modalElement);

    if (modal) {
      modal.hide();
    }

    // reset timer
    clearInterval(timerInterval);
    time = 300;
    sessionExpired = false;

    // riparte da 5 minuti
    avviaTimer();
  }

  document.getElementById("restore-session").addEventListener("click", () => {
    ripristinaSessione();
  });



  function avviaTimer() {

    clearInterval(timerInterval);
    timerInterval = setInterval(() => {

      let minutes = Math.floor(time / 60);
      let seconds = time % 60;

      document.getElementById("timer").textContent =
        `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

      if (time > 0) {
        time--;
      } else {
        clearInterval(timerInterval);
        mostraSessioneScaduta();
      }
    }, 1000);
  }
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

    while (selectedSeats.length > ticketCount) {
      let lastSeat = selectedSeats.pop();
      let img = lastSeat.querySelector("img");
      let type = lastSeat.dataset.type;

      img.src = seatImages[type].available;
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
    seatsList.classList.add("selected-seats-list");
    selectedSeats.forEach(seat => {

      let type = seat.dataset.type;
      let seatItem = document.createElement("div");

      seatItem.classList.add(
        "summary-seat-wrapper"
      );

      seatItem.innerHTML = `
      <div class="summary-seat">
        <img src="${seatImages[type].selected}">
      </div>

      <div class="summary-text">
        ${seat.dataset.positionView}
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
      let type = seat.dataset.type;

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


  document.querySelector(".btn-checkout")
    .addEventListener("click", () => {
      if (selectedSeats.length === 0) {
        alert("Seleziona almeno un posto");
        return;
      }
      acquistaBiglietto();
    });

  function mostraSessioneScaduta() {
    if (sessionExpired)
      return;
    sessionExpired = true;
    clearInterval(timerInterval);
    let modal = new bootstrap.Modal(
      document.getElementById("sessionExpiredModal")
    );
    modal.show();
  }
  /*
  =========================
      INIT
  =========================
  */
  console.log("ID SALA:", ID_SALA);
  caricaPrezzi();
  aggiornaPrezziLegenda();
  loadPosti(ID_SALA);
  updateUI();
  avviaTimer();
});