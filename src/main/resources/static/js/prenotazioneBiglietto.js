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
        PREZZI[tipo] = Number(posto.prezzoPosto) +  Number(PREZZO_FILM);
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
          case "green": return 1;     // Standard
          case "vip": return 2;       // V.I.P.
          case "disabled": return 3;  // Disabili
          default: return null;
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

  function loadPosti(idProgrammazione) {

    console.log("Parametro ricevuto da loadPosti:", idProgrammazione);

    fetch(`${BASE_URL_GET}/${idProgrammazione}`)
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
  ===============================
     PREZZO BACK-END MEMBERSHIP
  ===============================
  */
function calcolaPrezzoBackend() {

    if (selectedSeats.length === 0) {
        ultimoScontrino = null;
        totalPriceEl.textContent = "0.00";
        updateSummary();
        return;
    }

    let listaPostiDTO = selectedSeats.map(seat => ({
        id: reversePosizione(seat.dataset.positionView),
        tipo: reverseTipo(seat.dataset.type)
    }));

    let payload = {
        id_film: FILM_ID,
        id_utente: USER_ID,
        id_programmazione: ID_PROGRAMMAZIONE,
        listaPostiDTO: listaPostiDTO,
        acquisto: false
    };

    console.log("=== CALCOLO PREZZO BACKEND ===");
    console.log("payload:", payload);

    fetch(BASE_URL_POST, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    })
    .then(async res => {

        const testo = await res.text();

        console.log("=== RISPOSTA CALCOLO PREZZO ===");
        console.log("STATUS:", res.status);
        console.log("BODY:", testo);

        if (!res.ok) {
            throw new Error(
                `Errore calcolo prezzo - HTTP ${res.status} - ${testo}`
            );
        }

        return JSON.parse(testo);
    })
    .then(scontrino => {

        console.log("=== SCONTRINO CALCOLO ===");
        console.log(scontrino);

        ultimoScontrino = scontrino;

        if (!scontrino) {
            totalPriceEl.textContent = "0.00";
            updateSummary();
            return;
        }

        totalPriceEl.textContent =
            Number(scontrino.prezzoTotale).toFixed(2);

        updateSummary();

    })
    .catch(err => {
        console.error("=== ERRORE CALCOLO PREZZO ===", err);

        ultimoScontrino = null;
        totalPriceEl.textContent = "0.00";
        updateSummary();
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

    document.querySelector(".checkout-box")
        .classList.toggle(
            "hidden",
            selectedSeats.length === 0
        );

    minusBtn.classList.toggle(
        "disabled",
        ticketCount === 1
    );

    totalTicketsEl.textContent = selectedSeats.length;

    updateSummary();

    calcolaPrezzoBackend();
};

  //RIPRISTINO SESSIONE ALLO SCADERE DEL TEMPO
function ripristinaSessione() {

    // Deseleziona i posti attualmente selezionati
    selectedSeats.forEach(seat => {

        let img = seat.querySelector("img");
        let type = seat.dataset.type;

        img.src = seatImages[type].available;
        seat.classList.remove("selected");
    });

    selectedSeats = [];

    // Chiude la modal
    let modalElement =
        document.getElementById("sessionExpiredModal");

    let modal =
        bootstrap.Modal.getInstance(modalElement);

    if (modal) {
        modal.hide();
    }

    // Ricarica la situazione aggiornata dei posti
    loadPosti(ID_PROGRAMMAZIONE);

    // Aggiorna interfaccia
    updateUI();

    // Reset timer
    clearInterval(timerInterval);

    time = 300;
    sessionExpired = false;

    avviaTimer();
}


/*
=========================================================
    MODAL USCITA / NAVBAR
=========================================================
*/

let destinazioneNavbar = null;
let formLogoutDaEseguire = null;
let exitModalElement = document.getElementById("exitModal");
let exitModal = bootstrap.Modal.getOrCreateInstance(exitModalElement);
let confirmExit = document.getElementById("confirm-exit");
let keepSelection = document.querySelector(".keep-selection");


/*CLICK SUI LINK DELLA NAVBAR*/

document.querySelectorAll(".booking-nav-link").forEach(link => {
    link.addEventListener("click", function (event) {

        event.preventDefault();

        // Salvo dove voleva andare l'utente
        destinazioneNavbar = this.href;

        // Mostro la modal
        exitModal.show();
    });
});


/* CLICK SU "MANTIENI LA MIA SELEZIONE"*/

keepSelection.addEventListener("click", function (event) {
    event.preventDefault();

    // Chiudo la modal
    exitModal.hide();

    // Non devo più effettuare nessun redirect
    destinazioneNavbar = null;

    // Aggiorno la situazione dei posti
    loadPosti(ID_PROGRAMMAZIONE);
});

/*CLICK SU "ESCI"*/

confirmExit.addEventListener("click", function (event) {
    event.preventDefault();

    /*CASO LOGOUT*/

    if (formLogoutDaEseguire) {
        formLogoutDaEseguire.submit();
        return;
    }


    /*CASO LINK NORMALE*/

    if (destinazioneNavbar) {
        window.location.href = destinazioneNavbar;
    }

});

// MODAL SESSIONE SCADUTA - RIPRISTINA
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
        seatItem.classList.add("summary-seat-wrapper");

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

    if (!ultimoScontrino ||
        !ultimoScontrino.bigliettiAcquistati) {

        return;
    }

    let groups = {};

    ultimoScontrino.bigliettiAcquistati.forEach(biglietto => {

        let tipo = mapTipoPosto(biglietto.tipo);

        if (!tipo) {
            return;
        }

        // Prezzo pieno del singolo biglietto
        let prezzoPieno = Number(PREZZI[tipo]) || 0;

        // Prezzo effettivamente calcolato dal backend
        let prezzoFinale =
            Number(biglietto.prezzoBiglietto) || 0;

        /*
        ==========================================
            CALCOLO SCONTO DEL SINGOLO BIGLIETTO
        ==========================================
        */

        let percentuale = 0;

        if (prezzoPieno > 0 && prezzoFinale < prezzoPieno) {

            percentuale = Math.round(
                ((prezzoPieno - prezzoFinale) / prezzoPieno) * 100
            );
        }

        /*
        ==========================================
            GRUPPO = CATEGORIA + SCONTO
        ==========================================

        Esempio:

        green + 46%
        green + 20%
        vip + 20%

        vengono considerati gruppi separati.
        */

        let groupKey = `${tipo}_${percentuale}`;

        if (!groups[groupKey]) {

            groups[groupKey] = {
                type: tipo,
                count: 0,
                originalTotal: 0,
                total: 0,
                discount: percentuale
            };
        }

        groups[groupKey].count++;

        groups[groupKey].originalTotal += prezzoPieno;

        groups[groupKey].total += prezzoFinale;
    });


    /*
    =========================
        STAMPA GRUPPI
    =========================
    */

    Object.values(groups).forEach(group => {

        let categoryWrapper =
            document.createElement("div");

        categoryWrapper.classList.add("summary-category");


        let row =
            document.createElement("div");

        row.classList.add("summary-row");


        /*
        ==========================================
            PREZZO ORIGINALE
        ==========================================
        */

        let oldPriceHTML = "";

        if (group.discount > 0) {

            oldPriceHTML = `
                <span class="old-price">
                    ${group.originalTotal.toFixed(2)} €
                </span>
            `;
        }


        /*
        ==========================================
            BADGE SCONTO
        ==========================================
        */

        let badgeHTML = "";

        if (group.discount > 0) {

            badgeHTML = `
                <span class="discount-badge">
                    -${group.discount}%
                </span>
            `;
        }


        /*
        ==========================================
            RIGA
        ==========================================
        */

        row.innerHTML = `
            <div class="summary-left">
                <div class="summary-text">
                    ${group.count}
                    x Biglietto online
                    ${capitalize(group.type)}
                </div>
            </div>

            <div class="price-wrapper">

                <div class="summary-price">

                    ${oldPriceHTML}

                    <span class="current-price">
                        ${group.total.toFixed(2)} €
                    </span>

                    ${badgeHTML}

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

  // =========================================================
  // ACQUISTO BIGLIETTO
  // =========================================================
  function acquistaBiglietto() {

      let listaPostiDTO = selectedSeats.map(seat => ({
          id: reversePosizione(seat.dataset.positionView),
          tipo: reverseTipo(seat.dataset.type)
      }));

      // LOG — verifica cosa arriva al backend
      console.log("=== ACQUISTO BIGLIETTO ===");
      console.log("FILM_ID:", FILM_ID);
      console.log("USER_ID:", USER_ID);
      console.log("ID_PROGRAMMAZIONE:", ID_PROGRAMMAZIONE);
      console.log("listaPostiDTO:", listaPostiDTO);
      console.log("payload completo:", {
          id_film: FILM_ID,
          id_utente: USER_ID,
          id_programmazione: ID_PROGRAMMAZIONE,
          listaPostiDTO: listaPostiDTO,
          acquisto: true
      });
      // =========================================================

      fetch(BASE_URL_POST, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
              id_film: FILM_ID,
              id_utente: USER_ID,
              id_programmazione: ID_PROGRAMMAZIONE,
              listaPostiDTO: listaPostiDTO,
              acquisto: true
          })
      })
      .then(async res => {

          console.log("=== RISPOSTA BACKEND ===");
          console.log("STATUS:", res.status);
          console.log("OK:", res.ok);
          console.log("CONTENT-TYPE:", res.headers.get("content-type"));

          const testo = await res.text();

          console.log("BODY BACKEND:", testo);

          if (!res.ok) {
              throw new Error(
                  `Errore acquisto - HTTP ${res.status} - ${testo}`
              );
          }

          return JSON.parse(testo);
      })
      .then(scontrino => {
          console.log("=== Scontrino ricevuto:", scontrino);

          if (!scontrino || scontrino.success === false) {
              alert("Errore durante l'acquisto");
              return;
          }

          selectedSeats = [];
          updateUI();

          document.getElementById("main-content").classList.add("hidden");
          document.getElementById("success-message").classList.remove("hidden");

          setTimeout(() => {
              window.location.href = "/";
          }, 2000);
      })
      .catch(err => {
          console.error("=== Errore acquisto:", err);
      });
  }

  /*
  =========================
      INIT
  =========================
  */
  console.log("ID SALA:", ID_PROGRAMMAZIONE);
  caricaPrezzi();
  aggiornaPrezziLegenda();
  loadPosti(ID_PROGRAMMAZIONE);
  updateUI();
  avviaTimer();
});