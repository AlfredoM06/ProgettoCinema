document.addEventListener("DOMContentLoaded", function () {

    // =========================================================
    // |                                                       |
    // |              SIDEBAR E NAVIGAZIONE                    |
    // |                                                       |
    // =========================================================

    let buttons = document.querySelectorAll(".menu-btn");
    let sections = document.querySelectorAll(".content-section");

    // GESTIONE STATO SIDEBAR

    function clearSidebarActive() {
        document.querySelectorAll(".menu-btn").forEach(btn => {
            btn.classList.remove("active");
        });

        document.querySelectorAll(".dropdown-toggle-admin").forEach(btn => {
            btn.classList.remove("active");
        });
    }

    function closeDropdowns() {
        document.querySelectorAll(".dropdown-admin").forEach(dropdown => {
            dropdown.classList.remove("open");
        });
    }

    // MOSTRA SEZIONE
    function showSection(target) {
        sections.forEach(section => {
            section.style.display = "none";
        });

        let activeSection = document.getElementById(target);
        if (activeSection) {
            activeSection.style.display = "block";
        }

        clearSidebarActive();
        let btn = document.querySelector(`[data-target="${target}"]`);

        if (!btn) {
            return;
        }
        btn.classList.add("active");

        if (btn.closest(".dropdown-menu-admin")) {
            let dropdownParent = btn.closest(".dropdown-admin")?.querySelector(".dropdown-toggle-admin");
            if (dropdownParent) {
                dropdownParent.classList.add("active");
            }
        } else {
            closeDropdowns();
        }
    }

    // EVENTI SIDEBAR
    buttons.forEach(btn => {
        btn.addEventListener("click", () => {
            showSection(btn.dataset.target);
        });
    });

    document.querySelectorAll(".edit-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            showSection("profile");
        });
    });

    document.querySelectorAll(".dropdown-toggle-admin").forEach(btn => {
        btn.addEventListener("click", () => {
            let dropdown = btn.closest(".dropdown-admin");

            if (!dropdown) {
                return;
            }

            let isOpen = dropdown.classList.contains("open");
            clearSidebarActive();

            if (!isOpen) {
                btn.classList.add("active");
            }
            dropdown.classList.toggle("open");
        });
    });

    // =========================================================
    // |                                                       |
    // |                    GESTIONE FILM                      |
    // |                                                       |
    // =========================================================

    let filmSection = document.querySelector("#film");

    // ELEMENTI FORM FILM

    if (filmSection) {
        let btnConfermaFilm = filmSection.querySelector("button[type='submit']");
        let btnAnnullaFilm = filmSection.querySelector("button[type='reset']");
        let genereContainer = document.getElementById("genereContainer");
        let formatoItaContainer = document.getElementById("formatoItaContainer");
        let formatoEngContainer = document.getElementById("formatoEngContainer");

        // CARICAMENTO GENERI
        async function caricaGeneri() {
            try {
                const response = await fetch("/admin/gestioneFilm/listaGeneri");
                if (!response.ok) {
                    throw new Error();
                }
                const generi = await response.json();
                genereContainer.innerHTML = "";
                Object.entries(generi).forEach(
                    ([id, nome]) => {

                        genereContainer.innerHTML += `
                            <div class="col-6 form-check">

                                <input
                                    class="form-check-input"
                                    type="checkbox"
                                    name="genere"
                                    value="${id}"
                                    id="genere-${id}">
                                <label
                                    class="form-check-label"
                                    for="genere-${id}">
                                    ${nome}
                                </label>
                            </div>
                        `;
                    }
                );
            } catch (error) {
                console.error("Errore caricamento generi:", error);
                genereContainer.innerHTML = "<p>Impossibile caricare i generi.</p>";
            }
        }

        // CARICAMENTO FORMATI

        async function caricaFormati() {
            try {
                const response = await fetch("/admin/gestioneFilm/listaFormati");
                if (!response.ok) {
                    throw new Error();
                }
                const formati = await response.json();

                formatoItaContainer.innerHTML = "";
                formatoEngContainer.innerHTML = "";

                Object.entries(formati).forEach(
                    ([id, nome]) => {

                        // FORMATI ITALIANI
                        formatoItaContainer.innerHTML += `
                            <div class="col-5 form-check">

                                <input
                                    class="form-check-input"
                                    type="checkbox"
                                    name="formato-ita"
                                    value="${id}"
                                    id="formato-ita-${id}">

                                <label
                                    class="form-check-label"
                                    for="formato-ita-${id}">

                                    ${nome}
                                </label>
                            </div>
                        `;

                        // FORMATI INGLESI
                        formatoEngContainer.innerHTML += `
                            <div class="col-5 form-check">

                                <input
                                    class="form-check-input"
                                    type="checkbox"
                                    name="formato-eng"
                                    value="${id}"
                                    id="formato-eng-${id}">

                                <label
                                    class="form-check-label"
                                    for="formato-eng-${id}">
                                    ${nome}
                                </label>
                            </div>
                        `;
                    }
                );

            } catch (error) {
                console.error("Errore caricamento formati:", error);
                formatoItaContainer.innerHTML = "<p>Impossibile caricare i formati.</p>";
                formatoEngContainer.innerHTML = "<p>Impossibile caricare i formati.</p>";
            }
        }

        // RESET FORM FILM
        function resetFormFilm() {

            /*
             * L'assenza dell'id indica che il form è pronto
             * per l'inserimento di un nuovo film.
             */
            filmSection.dataset.id = "";

            // Svuota campi testuali
            filmSection
                .querySelectorAll(
                    "input[type='text'], " +
                    "input[type='url'], " +
                    "input[type='number'], " +
                    "input[type='date'], " +
                    "textarea"
                )
                .forEach(input => {
                    input.value = "";
                });


            // Deseleziona checkbox
            filmSection.querySelectorAll("input[type='checkbox']").forEach(input => {
                input.checked = false;
            });

            // Deseleziona radio
            filmSection.querySelectorAll("input[type='radio']").forEach(input => {
                input.checked = false;
            });
        }


        // SALVATAGGIO FILM

        btnConfermaFilm.addEventListener("click", async function (e) {
            e.preventDefault();

            // GENERI SELEZIONATI

            let generi = [...filmSection.querySelectorAll("input[name='genere']:checked")
            ].map(input => Number(input.value));


            // FORMATI ITALIANI

            let italiano = [...formatoItaContainer.querySelectorAll("input:checked")
            ].map(input => Number(input.value));


            // FORMATI INGLESI

            let inglese = [...formatoEngContainer.querySelectorAll("input:checked")
            ].map(input => Number(input.value));


            // PARTNERSHIP

            let partnership = filmSection.querySelector("input[name='partnership']:checked")?.value === "si";


            // STATO FILM

            let archiviato = filmSection.querySelector("input[name='statoFilm']:checked")?.value === "archiviato";

            // CREAZIONE DTO

            const dto = {
                id: filmSection.dataset.id ? Number(filmSection.dataset.id) : null,
                titolo: document.getElementById("titoloFilm").value,
                distribuzione: document.getElementById("distribuzione").value,
                sinossi: document.getElementById("sinossi").value,
                genere: generi,
                dataUscita: document.getElementById("dataUscita").value,
                durata: Number(document.getElementById("durataFilm").value),
                prezzo: Number(document.getElementById("prezzoFilm").value),
                italiano: italiano,
                inglese: inglese,
                imgCopertina: document.getElementById("imgCopertina").value,
                imgLocandina: document.getElementById("imgLocandina").value,
                imgLogo: document.getElementById("imgLogo").value,
                partnership: partnership,
                imgPartnership: partnership ? document.getElementById("imgPartnership").value : null,
                archiviato: archiviato
            };


            // VALIDAZIONE

            if (
                !dto.titolo ||
                !dto.dataUscita ||
                !dto.durata
            ) {
                alert("Compila almeno titolo, data di uscita e durata.");
                return;
            }

            // INVIO AL BACKEND

            try {

                const response = await fetch("/admin/gestioneFilm/salvaFilm", {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json"
                    },
                    body: JSON.stringify(dto)
                }
                );

                if (!response.ok) {
                    throw new Error();
                }

                alert(dto.id ? "Film modificato correttamente." : "Film salvato correttamente.");

                // Reset form
                resetFormFilm();
                // Aggiorna le tabelle
                ricaricaTabelleFilm();
            } catch (error) {
                console.error("Errore salvataggio film:", error);
                alert("Si è verificato un errore durante il salvataggio.");
            }
        }
        );


        // ANNULLA / RESET FILM

        btnAnnullaFilm.addEventListener("click", function () {
            resetFormFilm();
        }
        );
        // CARICAMENTO DATI INIZIALI FILM
        caricaGeneri();
        caricaFormati();
    }

    // MODIFICA FILM

    async function modificaFilm(id) {

        if (!filmSection) {
            console.error("Sezione film non trovata.");
            return;
        }
        try {
            // RECUPERO FILM
            const response = await fetch(`/admin/gestioneFilm/film/${id}`);
            if (!response.ok) {
                throw new Error("Errore nel recupero del film");
            }
            const film = await response.json();

            // DATI PRINCIPALI
            document.getElementById("titoloFilm").value = film.titolo ?? "";
            document.getElementById("distribuzione").value = film.distribuzione ?? "";
            document.getElementById("sinossi").value = film.sinossi ?? "";
            document.getElementById("dataUscita").value = film.dataUscita ?? "";
            document.getElementById("durataFilm").value = film.durata ?? "";
            document.getElementById("prezzoFilm").value = film.prezzo ?? "";
            document.getElementById("imgCopertina").value = film.imgCopertina ?? "";
            document.getElementById("imgLocandina").value = film.imgLocandina ?? "";
            document.getElementById("imgLogo").value = film.imgLogo ?? "";
            document.getElementById("imgPartnership").value = film.imgPartnership ?? "";

            // GENERI
            document.querySelectorAll("#genereContainer input[type='checkbox']")
                .forEach(checkbox => {
                    checkbox.checked = film.genere?.includes(Number(checkbox.value)) ?? false;
                });


            // FORMATI ITALIANI
            document.querySelectorAll("#formatoItaContainer input[type='checkbox']")
                .forEach(checkbox => {
                    checkbox.checked = film.italiano?.includes(Number(checkbox.value)) ?? false;
                });


            // FORMATI INGLESI
            document.querySelectorAll("#formatoEngContainer input[type='checkbox']")
                .forEach(checkbox => {
                    checkbox.checked =
                        film.inglese?.includes(
                            Number(checkbox.value)
                        ) ?? false;
                });


            // PARTNERSHIP
            if (film.partnership) {
                document.getElementById("partnershipSi").checked = true;
            } else {
                document.getElementById("partnershipNo").checked = true;
            }

            // STATO FILM
            if (film.archiviato) {
                document.getElementById("statoArchiviato").checked = true;
            } else {
                document.getElementById("statoInSala").checked = true;
            }


            // SALVA ID NEL FORM

            /*
             * Se dataset.id contiene un valore, il salvataggio
             * successivo verrà interpretato come modifica.
             */
            filmSection.dataset.id = film.id;

            // MOSTRA FORM FILM
            showSection("film");
            filmSection.scrollIntoView({ behavior: "smooth" });
        } catch (error) {
            console.error("Errore modifica film:", error);
            alert("Impossibile caricare il film.");
        }
    }


    // =========================================================
    // |                                                       |
    // |                  GESTIONE OFFERTE                     |
    // |                                                       |
    // =========================================================

    let offerteSection = document.querySelector("#offerte");

    if (offerteSection) {

        let btnConfermaOfferta = offerteSection.querySelector("button[type='submit']");
        let btnAnnullaOfferta = offerteSection.querySelector("button[type='reset']");
        let prezzoOfferta = document.getElementById("prezzoOfferta");
        let generiOfferta = offerteSection.querySelectorAll("input[name='genere']");
        let filmOfferta = document.getElementById("filmOfferta");

        // CARICAMENTO FILM PER OFFERTA

        fetch("/inSala/listaFilm")
            .then(response => {
                if (!response.ok) {
                    throw new Error("Errore nel recupero dei film");
                }
                return response.json();
            })
            .then(films => {
                filmOfferta.innerHTML = `
            <option value="">
                Seleziona Film
            </option>
        `;

                films.forEach(film => {

                    filmOfferta.innerHTML += `
                <option value="${film.id}">
                    ${film.titolo}
                </option>
            `;
                });
            })
            .catch(error => {
                console.error("Errore recupero film per offerta:", error);

                filmOfferta.innerHTML = `
            <option value="">
                Impossibile caricare i film
            </option>
        `;
            });
        //PREZZO OFFERTA DISABILITATA
        function aggiornaPrezzoOfferta() {
            let genereSelezionato = offerteSection.querySelector("input[name='genere']:checked")?.value;
            if (genereSelezionato === "bar") {
                prezzoOfferta.disabled = false;
            } else {
                prezzoOfferta.disabled = true;
                prezzoOfferta.value = "";
            }
        }

        generiOfferta.forEach(radio => { radio.addEventListener("change", aggiornaPrezzoOfferta); });
        aggiornaPrezzoOfferta();

        // RESET FORM OFFERTA
        function resetFormOfferta() {

            offerteSection.dataset.id = "";
            offerteSection.querySelectorAll(
                "input[type='text'], input[type='url'], input[type='number'], input[type='date'], textarea")
                .forEach(input => input.value = "");

            offerteSection.querySelectorAll("input[type='radio']").forEach(input => input.checked = false);
            filmOfferta.value = "";
            prezzoOfferta.disabled = true;
        }


        // SALVATAGGIO OFFERTA

        btnConfermaOfferta.addEventListener("click", async function (e) {
            e.preventDefault();

            // GENERE SELEZIONATO
            let genere = offerteSection.querySelector("input[name='genere']:checked")?.value;

            // PREZZO
            let prezzo = null;
            if (genere === "bar") {
                prezzo = Number(prezzoOfferta.value);
            }

            let dto = {
                id: offerteSection.dataset.id ? Number(offerteSection.dataset.id) : null,
                nome: document.getElementById("titoloOfferta").value,
                idFilm: filmOfferta.value ? Number(filmOfferta.value) : null,
                genere: genere,
                descrizione: document.getElementById("descrizioneOfferta").value,
                prezzo: prezzo,
                dataInizio: document.getElementById("dataInizioOfferta").value,
                dataScadenza: document.getElementById("dataScadenzaOfferta").value,
                imgBanner: document.getElementById("imgBanner").value,
                imgBannerTopOfferte: document.getElementById("imgBannerTopOfferte").value,
                imgDettaglio: document.getElementById("imgDettaglio").value
            };

            //        VALIDAZIONE
            if (!dto.nome || !genere || !dto.dataInizio || !dto.dataScadenza) {
                alert("Compila almeno titolo, genere, data inizio e data scadenza.");
                return;
            }
            if (dto.dataScadenza < dto.dataInizio) {
                alert("La data di scadenza non può essere precedente alla data di inizio.");
                return;
            }
            if (genere === "bar") {
                if (!prezzoOfferta.value || Number(prezzoOfferta.value) <= 0) {
                    alert("Inserisci un prezzo valido per l'offerta bar.");
                    return;
                }
                prezzo = Number(prezzoOfferta.value);
            }

            // INVIO AL BACKEND

            try {
                const response = await fetch("/admin/gestioneOfferte/salvaOfferta", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(dto)
                });

                if (!response.ok) throw new Error();

                alert(dto.id ? "Offerta modificata correttamente." : "Offerta salvata correttamente.");

                resetFormOfferta();
                ricaricaTabellaOfferte();

            } catch (error) {
                console.error("Errore salvataggio offerta:", error);
                alert("Si è verificato un errore durante il salvataggio.");
            }
        });


        // ANNULLA / RESET OFFERTA

        btnAnnullaOfferta.addEventListener("click", function () {
            resetFormOfferta();
        });

        // MODIFICA OFFERTA

        async function modificaOfferta(id) {

            if (!offerteSection) {
                console.error("Sezione offerte non trovata.");
                return;
            }

            try {
                const response = await fetch(`/admin/gestioneOfferte/getOfferta/${id}`);
                if (!response.ok) throw new Error("Errore nel recupero dell'offerta");

                const offerta = await response.json();

                document.getElementById("titoloOfferta").value = offerta.nome ?? "";
                let filmOfferta = document.getElementById("filmOfferta");
                if (filmOfferta) {
                    filmOfferta.value = offerta.idFilm != null ? String(offerta.idFilm) : "";
                }
                document.getElementById("descrizioneOfferta").value = offerta.descrizione ?? "";
                document.getElementById("prezzoOfferta").value = offerta.prezzo ?? "";
                document.getElementById("dataInizioOfferta").value = offerta.dataInizio ?? "";
                document.getElementById("dataScadenzaOfferta").value = offerta.dataScadenza ?? "";
                document.getElementById("imgBanner").value = offerta.imgBanner ?? "";
                document.getElementById("imgBannerTopOfferte").value = offerta.imgBannerTopOfferte ?? "";
                document.getElementById("imgDettaglio").value = offerta.imgDettaglio ?? "";

                let radioGenere = offerteSection.querySelector(`input[name='genere'][value="${offerta.genere}"]`);
                if (radioGenere) radioGenere.checked = true;
                aggiornaPrezzoOfferta();

                offerteSection.dataset.id = offerta.id;

                showSection("offerte");
                offerteSection.scrollIntoView({ behavior: "smooth" });

            } catch (error) {
                console.error("Errore modifica offerta:", error);
                alert("Impossibile caricare l'offerta.");
            }
        }
    }

    // =========================================================
    // |                                                       |
    // |              GESTIONE PROGRAMMAZIONE                  |
    // |                                                       |
    // =========================================================

    // ELEMENTI PROGRAMMAZIONE

    let programmazioneForm = document.querySelector("#programmazione");
    if (programmazioneForm) {

        let filmSelect = document.getElementById("filmSalaProgrammazione");
        let dataInput = document.getElementById("dataProgrammazione");

        let saleContainer = document.getElementById("saleContainer");
        let orariContainer = document.querySelector("#programmazione .orari-grid");
        let btnConferma = programmazioneForm.querySelector("button[type='submit']");
        let btnAnnulla = programmazioneForm.querySelector("button[type='reset']");

        // =========================================================
        // CONTROLLO ELEMENTI PROGRAMMAZIONE
        // =========================================================

        if (
            !filmSelect ||
            !dataInput ||
            !saleContainer ||
            !orariContainer ||
            !btnConferma ||
            !btnAnnulla
        ) {
            console.error("ERRORE: elementi mancanti nella sezione programmazione", {
                programmazioneForm,
                filmSelect,
                dataInput,
                saleContainer,
                orariContainer,
                btnConferma,
                btnAnnulla
            }
            );
            return;
        }

        // STATO PROGRAMMAZIONE
        let richiestaOrariInCorso = false;

        // Orari occupati dagli altri film
        let orariAltriFilm = [];

        // Orari della programmazione attualmente modificata
        let orariFilmCorrente = [];

        // Durata associata a ciascun orario
        let durataPerOrario = {};

        // Durata di ogni film
        let durataFilmMap = {};

        // Indica se il form è in modalità modifica
        let modalitaModifica = false;

        // GENERAZIONE ORARI
        /*
         * Genera gli orari ogni 10 minuti.
         * Fascia:
         * 11:00 -> 01:00
         */

        function generaOrari() {

            orariContainer.innerHTML = "";

            const start = 11 * 60;
            const end = 25 * 60;

            for (
                let minuti = start;
                minuti <= end;
                minuti += 10
            ) {

                let ore = Math.floor(minuti / 60);
                let min = minuti % 60;

                if (ore >= 24) {
                    ore -= 24;
                }

                let oraFormattata =
                    String(ore).padStart(2, "0") +
                    ":" +
                    String(min).padStart(2, "0");

                let id = `ora-${oraFormattata.replace(":", "-")}`;


                orariContainer.innerHTML += `
                <div class="form-check">

                    <input
                        class="form-check-input"
                        type="checkbox"
                        name="orari"
                        value="${oraFormattata}"
                        id="${id}"
                        disabled
                    >

                    <label
                        class="form-check-label"
                        for="${id}">
                        ${oraFormattata}
                    </label>

                </div>
            `;
            }
        }


        generaOrari();



        // =========================================================
        // RESET ORARI
        // =========================================================

        function resetOrari() {

            orariAltriFilm = [];
            orariFilmCorrente = [];
            durataPerOrario = {};

            document.querySelectorAll("#programmazione input[name='orari']")
                .forEach(cb => {

                    cb.disabled = true;
                    cb.checked = false;

                    let label = cb.nextElementSibling;

                    if (label) {
                        label.style.color = "";
                        label.style.textDecoration = "";
                        label.style.opacity = "";
                        label.title = "";
                    }
                });
        }


        // CARICAMENTO FILM PER PROGRAMMAZIONE

        fetch("/inSala/listaFilm").then(response => {

            if (!response.ok) {
                throw new Error("Errore nel recupero dei film");
            }
            return response.json();
        })
            .then(films => {

                filmSelect.innerHTML = `
                <option value="" disabled selected>
                    Seleziona film
                </option>
            `;

                films.forEach(film => {

                    filmSelect.innerHTML += `
                    <option value="${film.id}">
                        ${film.titolo}
                    </option>
                `;

                    durataFilmMap[film.id] =
                        film.durata;
                });
            })
            .catch(error => {
                console.error("Errore recupero film:", error);
            });



        // CARICAMENTO SALE

        fetch("/inSala/listaSale")
            .then(response => {

                if (!response.ok) {
                    throw new Error("Errore nel recupero delle sale");
                }
                return response.json();
            })
            .then(sale => {
                saleContainer.innerHTML = "";

                let col1 =
                    `<div class="col-6">`;

                let col2 =
                    `<div class="col-6">`;


                Object.entries(sale).forEach(
                    ([idSala, nomeSala], index) => {

                        const radio = `
                        <div class="form-check">

                            <input
                                class="form-check-input"
                                type="radio"
                                name="sala"
                                value="${idSala}"
                                id="sala-${idSala}"
                            >

                            <label
                                class="form-check-label"
                                for="sala-${idSala}">
                                ${nomeSala}
                            </label>

                        </div>
                    `;


                        if (index % 2 === 0) {
                            col1 += radio;
                        } else {
                            col2 += radio;
                        }
                    }
                );


                col1 += `</div>`;
                col2 += `</div>`;

                saleContainer.innerHTML =
                    col1 + col2;


                // Listener sulle sale generate dinamicamente
                document.querySelectorAll("#programmazione input[name='sala']").forEach(radio => {
                    radio.addEventListener("change", aggiornaOrariBackend);
                });
            })

            .catch(error => {
                console.error("Errore recupero sale:", error);
            });



        // EVENTI FILM / DATA

        filmSelect.addEventListener("change", aggiornaOrariBackend);
        dataInput.addEventListener("change", aggiornaOrariBackend);

        // RECUPERA ORARI DAL BACKEND

        async function aggiornaOrariBackend() {

            let data = dataInput.value;
            let sala = document.querySelector("#programmazione input[name='sala']:checked")?.value;


            // Se mancano dati sufficienti, resettiamo gli orari
            if (!data || !sala) {
                resetOrari();
                return;
            }

            // Evita richieste contemporanee
            if (richiestaOrariInCorso) {
                return;
            }
            richiestaOrariInCorso = true;
            resetOrari();

            try {

                // FETCH 1
                // ORARI OCCUPATI NELLA SALA

                const responseSala = await fetch(`/gestioneProgrammazione/getOrariPerSala/${sala}/${data}`);
                if (!responseSala.ok) {
                    throw new Error("Errore nel recupero degli orari della sala");
                }

                const orariSala = await responseSala.json();

                orariAltriFilm = [];
                durataPerOrario = {};


                Object.entries(orariSala).forEach(
                    ([orario, durata]) => {

                        orariAltriFilm.push(orario);

                        durataPerOrario[orario] =
                            Number(durata) || 0;
                    }
                );


                // FETCH 2
                // ORARI DEL FILM CORRENTE

                if (modalitaModifica) {

                    const film = filmSelect.value;

                    if (!film) {
                        throw new Error("Film non selezionato durante la modifica");
                    }


                    const responseFilm = await fetch(`/gestioneProgrammazione/getOrari/${film}/${sala}/${data}`);

                    if (!responseFilm.ok) {
                        throw new Error("Errore nel recupero degli orari del film");
                    }

                    const orariFilm = await responseFilm.json();
                    orariFilmCorrente = Object.keys(orariFilm);

                    // ---------------------------------------------
                    // Rimuove gli orari del film corrente dagli
                    // orari occupati dagli altri film
                    // ---------------------------------------------

                    orariAltriFilm =
                        orariAltriFilm.filter(
                            orario =>
                                !orariFilmCorrente.includes(orario)
                        );


                    // ---------------------------------------------
                    // Salva le durate degli orari correnti
                    // ---------------------------------------------

                    Object.entries(orariFilm).forEach(
                        ([orario, durata]) => {

                            durataPerOrario[orario] =
                                Number(durata) || 0;
                        }
                    );
                }


                // Prepara gli orari visualizzati
                preparaOrariDisponibili();

            } catch (error) {
                console.error("Errore backend orari:", error);
                resetOrari();
            } finally {
                richiestaOrariInCorso = false;
            }
        }


        // PREPARA ORARI DISPONIBILI

        function preparaOrariDisponibili() {

            let checkboxes = document.querySelectorAll("#programmazione input[name='orari']");


            // RESET GRAFICO

            checkboxes.forEach(cb => {

                cb.checked = false;
                cb.disabled = false;

                const label =
                    cb.nextElementSibling;

                if (label) {

                    label.style.color = "";
                    label.style.textDecoration = "";
                    label.style.opacity = "";
                    label.title = "";
                }
            });


            // BLOCCA ORARI OCCUPATI DA ALTRI FILM

            orariAltriFilm.forEach(orario => {

                const checkbox =
                    [...checkboxes].find(
                        cb => cb.value === orario
                    );

                if (!checkbox) {
                    return;
                }


                checkbox.disabled = true;

                const label =
                    checkbox.nextElementSibling;

                if (label) {

                    label.style.color = "#999";
                    label.style.textDecoration =
                        "line-through";
                    label.style.opacity = "0.6";
                    label.title =
                        "Orario occupato da un altro film";
                }


                bloccaIntervallo(
                    orario,
                    checkbox
                );
            });


            // MODIFICA:
            // RIATTIVA GLI ORARI DEL FILM CORRENTE

            if (modalitaModifica) {
                orariFilmCorrente.forEach(orario => {

                    const checkbox =
                        [...checkboxes].find(
                            cb => cb.value === orario
                        );

                    if (!checkbox) {
                        return;
                    }

                    checkbox.disabled = false;
                    checkbox.checked = true;

                    let label = checkbox.nextElementSibling;

                    if (label) {

                        label.style.color = "";
                        label.style.textDecoration = "";
                        label.style.opacity = "";
                        label.title =
                            "Orario della programmazione corrente";
                    }
                });
            }


            // EVENTI CHECKBOX ORARI

            checkboxes.forEach(cb => {
                cb.onchange = () => {
                    aggiornaBlocchiDurata();
                };
            });

            aggiornaBlocchiDurata();
        }


        // CONTROLLO DURATA FILM

        function aggiornaBlocchiDurata() {

            let checkboxes = document.querySelectorAll("#programmazione input[name='orari']");
            let filmSelezionato = filmSelect.value;
            let durataFilmSelezionato = Number(durataFilmMap[filmSelezionato]) || 0;

            // RESET DISPONIBILITÀ

            checkboxes.forEach(cb => {
                if (orariAltriFilm.includes(cb.value)) {
                    cb.disabled = true;
                } else {
                    cb.disabled = false;
                }
            });


            // BLOCCA DURATA DEGLI ALTRI FILM

            orariAltriFilm.forEach(orario => {
                const checkbox =
                    [...checkboxes].find(
                        cb => cb.value === orario
                    );
                if (checkbox) {
                    bloccaIntervallo(
                        orario,
                        checkbox
                    );
                }
            });


            // BLOCCA DURATA DEGLI ORARI SELEZIONATI

            let selezionati = [...checkboxes].filter(cb => cb.checked);

            selezionati.forEach(cb => {
                durataPerOrario[cb.value] = durataFilmSelezionato;
                bloccaIntervallo(cb.value, cb);
            });
        }



        // BLOCCA INTERVALLO DURATA FILM

        function bloccaIntervallo(orarioSelezionato, checkboxSelezionato) {
            let durata = Number(durataPerOrario[orarioSelezionato]) || 0;

            if (durata <= 0) {
                return;
            }

            let startMin = convertiOraInMinuti(orarioSelezionato);
            let endMin = startMin + durata;
            let checkboxes = document.querySelectorAll("#programmazione input[name='orari']");

            checkboxes.forEach(cb => {
                if (cb === checkboxSelezionato) {
                    return;
                }

                // Durante la modifica non bloccare gli orari
                // appartenenti al film corrente
                if (modalitaModifica && orariFilmCorrente.includes(cb.value)) {
                    return;
                }

                let currentMin = convertiOraInMinuti(cb.value);

                if (currentMin > startMin && currentMin < endMin) {
                    cb.disabled = true;

                    let label = cb.nextElementSibling;

                    if (label) {
                        label.style.color = "#999";
                        label.style.opacity = "0.6";
                        label.title =
                            "Orario bloccato dalla durata del film";
                    }
                }
            });
        }


        // CONVERSIONE ORARIO -> MINUTI

        function convertiOraInMinuti(ora) {

            let [ore, minuti] = ora.split(":").map(Number);

            /*
             * Gli orari dopo mezzanotte appartengono
             * alla giornata successiva.
             */

            if (ore < 11) {
                ore += 24;
            }
            return ore * 60 + minuti;
        }


        // RESET COMPLETO PROGRAMMAZIONE

        function resetFormProgrammazione() {
            filmSelect.selectedIndex = 0;
            dataInput.value = "";

            document.querySelectorAll("#programmazione input[name='sala']")
                .forEach(radio => {
                    radio.checked = false;
                });
            resetOrari();
        }

        // MODIFICA PROGRAMMAZIONE

        async function modificaProgrammazione(film, sala, data) {
            try {
                // Attiva modalità modifica
                modalitaModifica = true;

                // FILM
                filmSelect.value = film;


                // DATA

                dataInput.value = data;


                // -----------------------------------------------------
                // SALA
                // -----------------------------------------------------

                let radioSala = document.querySelector(`#programmazione input[name='sala'][value="${sala}"]`);

                if (!radioSala) {
                    throw new Error("Sala della programmazione non trovata");
                }

                radioSala.checked = true;

                // CARICA ORARI DAL BACKEND
                await aggiornaOrariBackend();


                // SELEZIONA ORARI ATTUALI

                document.querySelectorAll("#programmazione input[name='orari']").forEach(cb => {
                    cb.checked = orariFilmCorrente.includes(cb.value);
                });

                aggiornaBlocchiDurata();


                // PORTA L'UTENTE AL FORM

                document.getElementById("programmazione")?.scrollIntoView({ behavior: "smooth" });
            } catch (error) {
                console.error("Errore modifica programmazione:", error);
                alert("Impossibile caricare la programmazione.");
            }
        }


        // ELIMINA PROGRAMMAZIONE

        async function eliminaProgrammazione(film, sala, data) {

            let conferma = confirm("Sei sicuro di voler eliminare questa programmazione?");

            if (!conferma) {
                return;
            }

            try {
                const response = await fetch(`/gestioneProgrammazione/cancellaProgrammazione/${film}/${sala}/${data}`,
                    {
                        method: "POST"
                    }
                );


                if (!response.ok) {
                    throw new Error("Errore durante la cancellazione della programmazione");
                }

                alert("Programmazione eliminata correttamente.");
                caricaTabellaProgrammazioni();

            } catch (error) {
                console.error("Errore eliminazione programmazione:", error);
                alert("Si è verificato un errore durante l'eliminazione.");
            }
        }



        // CARICAMENTO TABELLA PROGRAMMAZIONI
        caricaTabellaProgrammazioni();


        // SALVATAGGIO PROGRAMMAZIONE
        btnConferma.addEventListener("click", async function (e) {
            e.preventDefault();

            let film = filmSelect.value;
            let data = dataInput.value;
            let sala = document.querySelector("#programmazione input[name='sala']:checked")?.value;
            let orariSelezionati =
                [
                    ...document.querySelectorAll(
                        "#programmazione input[name='orari']:checked"
                    )
                ].map(cb => cb.value);


            // VALIDAZIONE

            if (!film || !data || !sala) {
                alert("Seleziona film, data e sala.");
                return;
            }

            if (orariSelezionati.length === 0) {
                alert("Seleziona almeno un orario.");
                return;
            }

            try {
                // MODIFICA PROGRAMMAZIONE

                if (modalitaModifica) {

                    // 1. CANCELLA PROGRAMMAZIONE ESISTENTE

                    const responseDelete =
                        await fetch(`/gestioneProgrammazione/cancellaProgrammazione/${film}/${sala}/${data}`,
                            {
                                method: "POST"
                            }
                        );


                    if (!responseDelete.ok) {
                        throw new Error("Errore durante la cancellazione delle programmazioni");
                    }

                    // 2. RICREA LE PROGRAMMAZIONI

                    await Promise.all(
                        orariSelezionati.map(
                            async orario => {
                                const response =
                                    await fetch(
                                        "/gestioneProgrammazione/salvaProgrammazione",
                                        {
                                            method: "POST",
                                            headers: {
                                                "Content-Type":
                                                    "application/json"
                                            },
                                            body:
                                                JSON.stringify({
                                                    idFilm: film,
                                                    idSala: sala,
                                                    data: data,
                                                    orario: orario
                                                })
                                        }
                                    );
                                if (!response.ok) {
                                    throw new Error("Errore durante il salvataggio della programmazione");
                                }
                                return response.json();
                            }
                        )
                    );
                    alert("Programmazione modificata correttamente.");


                    // NUOVA PROGRAMMAZIONE
                } else {
                    await Promise.all(
                        orariSelezionati.map(
                            async orario => {
                                const response =
                                    await fetch(
                                        "/gestioneProgrammazione/salvaProgrammazione",
                                        {
                                            method: "POST",
                                            headers: {
                                                "Content-Type":
                                                    "application/json"
                                            },
                                            body:
                                                JSON.stringify({
                                                    idFilm: film,
                                                    idSala: sala,
                                                    data: data,
                                                    orario: orario
                                                })
                                        }
                                    );

                                if (!response.ok) {
                                    throw new Error("Errore durante il salvataggio");
                                }
                                return response.json();
                            }
                        )
                    );

                    alert("Programmazione salvata correttamente.");
                }

                // RESET

                resetFormProgrammazione();
                modalitaModifica = false;

                // AGGIORNA TABELLA

                caricaTabellaProgrammazioni();
            } catch (error) {
                console.error("Errore programmazione:", error);
                alert("Si è verificato un errore.");
            }
        }
        );


        // ANNULLA MODIFICA PROGRAMMAZIONE

        btnAnnulla.addEventListener("click", function () {
            modalitaModifica = false;
            resetFormProgrammazione();
        }
        );
    }


    // =========================================================
    // |                                                       |
    // |                   FORM UTENTI                         |
    // |                                                       |
    // =========================================================

    // =========================================================
    // |                                                       |
    // |                    FORM UTENTI                        |
    // |                                                       |
    // =========================================================

    let utenteSection = document.getElementById("utenti");

    if (utenteSection) {

        let nomeInput = document.getElementById("nome");
        let cognomeInput = document.getElementById("cognome");
        let emailInput = document.getElementById("email");
        let ruoliContainer = document.getElementById("ruoliContainer");

        let modalitaModifica = false;
        let utenteIdModifica = null;


        // =====================================================
        // CONTROLLO ELEMENTI
        // =====================================================

        if (
            !nomeInput ||
            !cognomeInput ||
            !emailInput ||
            !ruoliContainer
        ) {

            console.error("Elementi form utenti mancanti.");

        } else {


            // =================================================
            // CARICAMENTO RUOLI
            // =================================================

            async function caricaRuoli() {

                try {

                    const response =
                        await fetch("/admin/gestioneUtenti/listaRuoli");

                    if (!response.ok) {
                        throw new Error(
                            "Errore nel recupero dei ruoli"
                        );
                    }

                    const ruoli = await response.json();

                    ruoliContainer.innerHTML = "";

                    Object.entries(ruoli).forEach(
                        ([idRuolo, nomeRuolo]) => {

                            ruoliContainer.innerHTML += `
                                <div class="form-check">

                                    <input
                                        class="form-check-input"
                                        type="radio"
                                        name="ruolo"
                                        value="${idRuolo}"
                                        id="ruolo-${idRuolo}"
                                    >

                                    <label
                                        class="form-check-label"
                                        for="ruolo-${idRuolo}">
                                        ${nomeRuolo}
                                    </label>

                                </div>
                            `;
                        }
                    );

                } catch (error) {

                    console.error(
                        "Errore recupero ruoli:",
                        error
                    );
                }
            }


            // =================================================
            // RESET FORM UTENTE
            // =================================================

            function resetFormUtente() {

                nomeInput.value = "";
                cognomeInput.value = "";
                emailInput.value = "";

                ruoliContainer
                    .querySelectorAll("input[name='ruolo']")
                    .forEach(radio => {
                        radio.checked = false;
                    });

                modalitaModifica = false;
                utenteIdModifica = null;

                utenteSection.dataset.id = "";
            }


            // MODIFICA UTENTE

            async function modificaUtente(id) {

                try {
                    const response = await fetch(`/admin/gestioneUtenti/getUtente/${id}`);

                    if (!response.ok) {
                        throw new Error("Errore nel recupero dell'utente");
                    }

                    const utente = await response.json();

                    modalitaModifica = true;
                    utenteIdModifica = utente.id;
                    nomeInput.value = utente.nome ?? "";
                    cognomeInput.value = utente.cognome ?? "";
                    emailInput.value =utente.email ?? "";

                    ruoliContainer.querySelectorAll("input[name='ruolo']").forEach(radio => {
                            radio.checked = String(radio.value) === String(utente.idRuolo);
                        });

                    // Salviamo l'id nella section
                    utenteSection.dataset.id =utente.id;

                    // Mostra la sezione utenti
                    showSection("utenti");

                    utenteSection.scrollIntoView({
                        behavior: "smooth"
                    });
                } catch (error) {
                    console.error("Errore modifica utente:", error);
                    alert("Impossibile caricare l'utente.");
                }
            }


            // SALVATAGGIO UTENTE
            async function salvaUtente() {
                let nome = nomeInput.value.trim();
                let cognome = cognomeInput.value.trim();
                let email = emailInput.value.trim();
                let radioRuolo = ruoliContainer.querySelector( "input[name='ruolo']:checked");
                let idRuolo = radioRuolo ? Number(radioRuolo.value) : null;


                // VALIDAZIONE
                if (
                    !nome ||
                    !cognome ||
                    !email ||
                    !idRuolo
                ) {
                    alert("Compila tutti i campi.");
                    return;
                }


                // DTO
                let dto = {
                    id: modalitaModifica ? utenteIdModifica : null,
                    nome: nome,
                    cognome: cognome,
                    email: email,
                    idRuolo: idRuolo
                };


                // INVIO AL BACKEND
                try {
                    const response =await fetch("/admin/gestioneUtenti/salvaUtente",{
                                method: "POST",
                                headers: {
                                    "Content-Type":
                                        "application/json"
                                },
                                body:
                                    JSON.stringify(dto)
                            }
                        );

                    if (!response.ok) {
                        throw new Error( "Errore durante il salvataggio" );
                    }

                    await response.json();

                    alert(modalitaModifica ? "Utente modificato correttamente.": "Utente salvato correttamente.");
                    resetFormUtente();
                    caricaTabellaUtenti();

                } catch (error) {
                    console.error("Errore salvataggio utente:",error);
                    alert( "Si è verificato un errore durante il salvataggio." );
                }
            }


            // CARICA RUOLI
            caricaRuoli();

            // BOTTONI FORM
            let btnConfermaUtente = utenteSection.querySelector("button[type='submit']");
            let btnAnnullaUtente =utenteSection.querySelector("button[type='reset']");


            if (btnConfermaUtente) {
                btnConfermaUtente.addEventListener("click", function (e) {
                        e.preventDefault();
                        salvaUtente();
                    }
                );
            }

            if (btnAnnullaUtente) {
                btnAnnullaUtente.addEventListener("click", function (e) {
                        e.preventDefault();
                        resetFormUtente();
                    }
                );
            }

            // ESPONI MODIFICA AL LISTENER UNICO
            window.modificaUtente = modificaUtente;
        }
    }

    // CARICAMENTO TABELLA UTENTI
    caricaTabellaUtenti();

// =========================================================
// |                                                       |
// |      LISTENER UNICO BOTTONI DELLE TABELLE             |
// |                                                       |
// =========================================================


    document.addEventListener("click", async function (e) {

        // FILM - MODIFICA

        let editFilmBtn = e.target.closest(".btn-edit-film");

        if (editFilmBtn) {
            await modificaFilm(editFilmBtn.dataset.id);
            return;
        }


    // FILM - ARCHIVIA / CAMBIA STATO

    let archiveFilmBtn = e.target.closest(".btn-archive-film");

    if (archiveFilmBtn) {
        let id = archiveFilmBtn.dataset.id;
        let conferma = confirm("Vuoi modificare lo stato del film?");


        if (!conferma) {
            return;
        }

        try {

            const response = await fetch(`/admin/gestioneFilm/archivia/${id}`, {
                method: "POST"
            }
            );

            if (!response.ok) {
                throw new Error();
            }

            ricaricaTabelleFilm();
        } catch (error) {
            console.error("Errore archiviazione film:", error);
            alert("Impossibile modificare lo stato del film.");
        }
        return;
    }

    // FILM - ELIMINA

    let deleteFilmBtn = e.target.closest(".btn-delete-film");

    if (deleteFilmBtn) {
        let id = deleteFilmBtn.dataset.id;
        let conferma = confirm("Sei sicuro di voler eliminare questo film?");


        if (!conferma) {
            return;
        }

        try {
            const response = await fetch(`/admin/gestioneFilm/cancellaFilm/${id}`, {
                method: "POST"
            }
            );

            if (!response.ok) {
                throw new Error();
            }

            ricaricaTabelleFilm();
        } catch (error) {
            console.error("Errore eliminazione film:", error);
            alert("Impossibile eliminare il film.");
        }
        return;
    }


    // PROGRAMMAZIONE - MODIFICA

    let editProgrammazioneBtn = e.target.closest(".btn-edit-programmazione");


    if (editProgrammazioneBtn) {
        await modificaProgrammazione(
            editProgrammazioneBtn.dataset.film,
            editProgrammazioneBtn.dataset.sala,
            editProgrammazioneBtn.dataset.data
        );
        return;
    }



    // PROGRAMMAZIONE - ELIMINA

    let deleteProgrammazioneBtn = e.target.closest(".btn-delete-programmazione");


    if (deleteProgrammazioneBtn) {
        await eliminaProgrammazione(
            deleteProgrammazioneBtn.dataset.film,
            deleteProgrammazioneBtn.dataset.sala,
            deleteProgrammazioneBtn.dataset.data
        );
        return;
    }

    // OFFERTE - MODIFICA

    let editOffertaBtn = e.target.closest(".btn-edit-offerta");

    if (editOffertaBtn) {
        await modificaOfferta(editOffertaBtn.dataset.id);
        return;
    }


    // OFFERTE - ELIMINA

    let deleteOffertaBtn = e.target.closest(".btn-delete-offerta");

    if (deleteOffertaBtn) {
        let id = deleteOffertaBtn.dataset.id;
        let conferma = confirm("Sei sicuro di voler eliminare questa offerta?");

        if (!conferma) return;

        try {
            const response = await fetch(`/admin/gestioneOfferte/cancellaOfferta/${id}`, { method: "POST" });
            if (!response.ok) throw new Error();
            ricaricaTabellaOfferte();
        } catch (error) {
            console.error("Errore eliminazione offerta:", error);
            alert("Impossibile eliminare l'offerta.");
        }
        return;
    }
    // =====================================================
        // UTENTI - MODIFICA
        // =====================================================

        let editUtenteBtn = e.target.closest(".btn-edit-utente" );

        if (editUtenteBtn) {
            if (typeof window.modificaUtente === "function") {
                await window.modificaUtente(editUtenteBtn.dataset.id);
            }
            return;
        }


        // =====================================================
        // UTENTI - ELIMINA
        // =====================================================

        let deleteUtenteBtn = e.target.closest( ".btn-delete-utente");

        if (deleteUtenteBtn) {
            let id =deleteUtenteBtn.dataset.id;
            let conferma = confirm("Sei sicuro di voler eliminare questo utente?");

            if (!conferma) {
                return;
            }

            try {

                const response =
                    await fetch( `/admin/gestioneUtenti/cancellaUtente/${id}`,
                        {
                            method: "POST"
                        }
                    );

                if (!response.ok) {
                    throw new Error();
                }

                alert("Utente eliminato correttamente.");
                caricaTabellaUtenti();

            } catch (error) {
                console.error("Errore eliminazione utente:", error);
                alert("Impossibile eliminare l'utente.");
            }
            return;
        }

    });
});