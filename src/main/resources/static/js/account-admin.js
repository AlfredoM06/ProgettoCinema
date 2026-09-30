document.addEventListener("DOMContentLoaded", function () {
    // =========================================================
    // |                 FILTRI DI DIGITAZIONE                 |
    // =========================================================

    // Solo testo: impedisce di scrivere numeri (regista, cast)
    function bloccaNumeri(input) {
        input.addEventListener("beforeinput", e => {
            if (e.data && /\d/.test(e.data)) {
                e.preventDefault();
            }
        });
        // Rete di sicurezza (es. incolla)
        input.addEventListener("input", () => {
            input.value = input.value.replace(/\d/g, "");
        });
    }

    // Solo numeri interi (durata)
    function soloInteri(input) {
        input.addEventListener("beforeinput", e => {
            if (e.data && /\D/.test(e.data)) {
                e.preventDefault();
            }
        });
        input.addEventListener("input", () => {
            input.value = input.value.replace(/\D/g, "");
        });
    }

    // Prezzo: solo cifre e una virgola, massimo 2 decimali
    function filtroPrezzo(input) {
        input.addEventListener("input", () => {
            let v = input.value.replace(/[^\d,]/g, "");
            let i = v.indexOf(",");
            if (i !== -1) {
                v = v.slice(0, i + 1) + v.slice(i + 1).replace(/,/g, "").slice(0, 2);
            }
            input.value = v;
        });
    }

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

    let formatiPromise = Promise.resolve();
    let generiPromise = Promise.resolve();
    // ELEMENTI FORM FILM

    if (filmSection) {
        let btnConfermaFilm = filmSection.querySelector("button[type='submit']");
        let btnAnnullaFilm = filmSection.querySelector("button[type='reset']");
        let genereContainer = document.getElementById("genereContainer");
        let formatoItaContainer = document.getElementById("formatoItaContainer");
        let formatoEngContainer = document.getElementById("formatoEngContainer");

        let registaInput = document.getElementById("regista");
        let castInput = document.getElementById("cast");
        let durataInput = document.getElementById("durataFilm");
        let prezzoInput = document.getElementById("prezzoFilm");

        bloccaNumeri(registaInput);
        bloccaNumeri(castInput);
        soloInteri(durataInput);
        filtroPrezzo(prezzoInput);

        durataInput.placeholder = "120";
        prezzoInput.placeholder = "8,50";
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
        formatiPromise = caricaFormati();
        generiPromise = caricaGeneri();

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

            let regista = registaInput.value.trim();
            let cast = castInput.value.trim();
            let durata = durataInput.value.trim();
            let prezzo = prezzoInput.value.trim();

            // Il prezzo, se presente, deve avere la virgola e 2 decimali
            if (prezzo && !/^\d+,\d{2}$/.test(prezzo)) {
                alert("Inserisci il prezzo con la virgola, ad esempio 8,50.");
                return;
            }

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
                regista: regista,
                cast: cast,
                sinossi: document.getElementById("sinossi").value,
                genere: generi,
                dataUscita: document.getElementById("dataUscita").value,
                scadenza: document.getElementById("dataFine").value,
                durata: durata ? Number(durata) : null,
                prezzo: prezzo ? Number(prezzo.replace(",", ".")) : null,
                italiano: italiano,
                inglese: inglese,
                imgCopertina: document.getElementById("imgCopertina").value,
                imgLocandina: document.getElementById("imgLocandina").value,
                imgLogo: document.getElementById("imgLogo").value,
                titoloPartnership: document.getElementById("titoloPartnership").value,
                linkYouTube: document.getElementById("linkYouTube").value,
                partnership: partnership,
                imgPartnership: partnership ? document.getElementById("imgPartnership").value : null,
                archiviato: archiviato
            };

            console.log("CHECKBOX ITA SELEZIONATI:",
                [...formatoItaContainer.querySelectorAll("input:checked")]
                    .map(input => ({
                        value: input.value,
                        name: input.name,
                        id: input.id
                    }))
            );

            console.log("CHECKBOX ENG SELEZIONATI:",
                [...formatoEngContainer.querySelectorAll("input:checked")]
                    .map(input => ({
                        value: input.value,
                        name: input.name,
                        id: input.id
                    }))
            );
            console.log("DTO FILM INVIATO:", dto);
            console.log("Italiano:", dto.italiano);
            console.log("Inglese:", dto.inglese);

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
                    let errore = await response.text();
                    console.error("Status:", response.status);
                    console.error("Backend:", errore);
                    throw new Error(
                        `Errore HTTP ${response.status}: ${errore}`
                    );
                }
                alert( dto.id ? "Film modificato correttamente.": "Film salvato correttamente.");


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

    }

    // MODIFICA FILM
    async function modificaFilm(id) {

        if (!filmSection) {
            console.error("Sezione film non trovata.");
            return;
        }
        try {
            // Aspetta che generi e formati siano stati caricati
                await generiPromise;
                await formatiPromise;
            // RECUPERO FILM
            const response = await fetch(`/admin/gestioneFilm/film/${id}`);
            if (!response.ok) {
                throw new Error("Errore nel recupero del film");
            }
            const film = await response.json();

            // DATI PRINCIPALI
            document.getElementById("prezzoFilm").value = film.prezzo != null ? Number(film.prezzo).toFixed(2).replace(".", ",") : "";
            document.getElementById("titoloFilm").value = film.titolo ?? "";
            document.getElementById("distribuzione").value = film.distribuzione ?? "";
            document.getElementById("regista").value = film.regista ?? "";
            document.getElementById("cast").value = film.cast ?? "";
            document.getElementById("sinossi").value = film.sinossi ?? "";
            document.getElementById("dataUscita").value = film.dataUscita ?? "";
            document.getElementById("dataFine").value = film.scadenza ?? "";
            document.getElementById("durataFilm").value = film.durata ?? "";
            document.getElementById("imgCopertina").value = film.imgCopertina ?? "";
            document.getElementById("imgLocandina").value = film.imgLocandina ?? "";
            document.getElementById("imgLogo").value = film.imgLogo ?? "";
            document.getElementById("linkYouTube").value = film.linkYouTube ?? "";
            document.getElementById("imgPartnership").value = film.imgPartnership ?? "";
            document.getElementById("titoloPartnership").value = film.titoloPartnership ?? "";

            // GENERI
            document.querySelectorAll("#genereContainer input[type='checkbox']")
                .forEach(checkbox => {
                    checkbox.checked = film.genere?.includes(Number(checkbox.value)) ?? false;
                });


            // FORMATI ITALIANI
            const formatiItaliani = film.italiano ?? [];
            console.log("Formati italiani ricevuti:", formatiItaliani);

            document.querySelectorAll("#formatoItaContainer input[type='checkbox']").forEach(checkbox => {
                    const idFormato = Number(checkbox.value);
                    checkbox.checked = formatiItaliani.includes(idFormato);
                    console.log("ITA","id:", idFormato,"checked:", checkbox.checked);
                });


            // FORMATI INGLESI
            // FORMATI INGLESI
            const formatiInglesi = film.inglese ?? [];
            console.log("Formati inglesi ricevuti:", formatiInglesi);
            document.querySelectorAll("#formatoEngContainer input[type='checkbox']").forEach(checkbox => {
                    const idFormato = Number(checkbox.value);
                    checkbox.checked = formatiInglesi.includes(idFormato);
                    console.log( "ENG", "id:", idFormato,"checked:", checkbox.checked);
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
        offerteSection.dataset.id = "";
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
            if (genereSelezionato === "menu") {
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
            if (genere === "menu") {
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
            if (genere === "menu") {
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
        window.modificaOfferta = modificaOfferta;
    }

// =========================================================
// |                                                       |
// |              GESTIONE PROGRAMMAZIONE                  |
// |                                                       |
// =========================================================

let programmazioneForm = document.querySelector("#programmazione");

if (programmazioneForm) {

    // =========================================================
    // ELEMENTI PROGRAMMAZIONE
    // =========================================================

    let filmSelect = document.getElementById("filmSalaProgrammazione");
    let dataInput = document.getElementById("dataProgrammazione");
    let saleContainer = document.getElementById("saleContainer");
    let linguaSelect = document.getElementById("linguaProgrammazione");
    let orariContainer = document.querySelector("#programmazione .orari-grid");
    let btnConferma = programmazioneForm.querySelector("button[type='submit']");
    let btnAnnulla = programmazioneForm.querySelector("button[type='reset']");


    // =========================================================
    // CONTROLLO ELEMENTI
    // =========================================================

    if (
        !filmSelect ||
        !dataInput ||
        !saleContainer ||
        !linguaSelect ||
        !orariContainer ||
        !btnConferma ||
        !btnAnnulla
    ) {

        console.error(
            "ERRORE: elementi mancanti nella sezione programmazione",
            {
                programmazioneForm,
                filmSelect,
                dataInput,
                saleContainer,
                linguaSelect,
                orariContainer,
                btnConferma,
                btnAnnulla
            }
        );

        return;
    }


    // =========================================================
    // STATO PROGRAMMAZIONE
    // =========================================================
    let richiestaOrariInCorso = false;
    // Orari occupati dagli altri film
    let orariAltriFilm = [];
    // Orari della programmazione corrente
    let orariFilmCorrente = [];
    // Durata associata a ciascun orario
    let durataPerOrario = {};
    // Indica quali orari sono anteprima
    let anteprimaPerOrario = {};
    // Durata di ogni film
    let durataFilmMap = {};
    // Modalità modifica
    let modalitaModifica = false;
    // Lingua associata a ciascun orario
    let linguaPerOrario = {};


    // Nome di ogni lingua (id -> nome)
    let linguaNomeMap = {};

    function isInglese(idLingua) {
        const nome = (linguaNomeMap[idLingua] || "").toLowerCase();
        return nome === "eng" || nome.startsWith("ing") || nome.startsWith("eng");
    }

    // =========================================================
    // MAPPA FORMATI SALE
    // =========================================================
    let saleFormatiMap = {};


    // =========================================================
    // GENERAZIONE ORARI
    // =========================================================

    function generaOrari() {
        orariContainer.innerHTML = "";
        const start = 11 * 60;
        const end = 23 * 60 + 50;
        for (
            let minuti = start;
            minuti <= end;
            minuti += 10
        ) {
            let ore = Math.floor(minuti / 60);
            let min = minuti % 60;

            let oraFormattata =
                String(ore).padStart(2, "0") +
                ":" +
                String(min).padStart(2, "0");

            let id =`ora-${oraFormattata.replace(":", "-")}`;

            orariContainer.innerHTML += `
                <div class="form-check">

                    <input
                        class="form-check-input orario-checkbox"
                        type="checkbox"
                        name="orari"
                        value="${oraFormattata}"
                        id="${id}"
                        disabled
                    >

                    <label
                        class="form-check-label orario-label"
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
        anteprimaPerOrario = {};
        linguaPerOrario = {};

        document.querySelectorAll("#programmazione input[name='orari']").forEach(cb => {
                cb.disabled = true;
                cb.checked = false;

                let contenitore = cb.closest(".form-check");
                if (contenitore) {
                    contenitore.classList.remove("is-selected", "is-anteprima","is-inglese");
                }

                let label = cb.nextElementSibling;
                if (label) {
                    label.style.color = "";
                    label.style.textDecoration = "";
                    label.style.opacity = "";
                    label.title = "";
                }
            });
    }

    // =========================================================
    // RESET LINGUA
    // =========================================================

    function resetLingua() {
        linguaSelect.innerHTML = `
            <option value="" disabled selected>
                Seleziona lingua...
            </option>
        `;
        linguaSelect.disabled = true;
    }


    // =========================================================
    // CARICA LINGUE COMPATIBILI CON FILM + FORMATO SALA
    // =========================================================

    async function caricaLingueCompatibili(idFilm, formatoSala) {
        resetLingua();
        if (!idFilm || !formatoSala) {
            return;
        }
        try {

            // 1. Recupera le lingue disponibili per il film

            const responseLingue = await fetch(`/gestioneProgrammazione/lingueFilm/${idFilm}`);

            if (!responseLingue.ok) {
                throw new Error("Errore nel recupero delle lingue del film");
            }

            const lingue = await responseLingue.json();

            Object.entries(lingue).forEach(([id, nome]) => {
                linguaNomeMap[id] = nome;
            });
            // 2. Per ogni lingua controllo i formati

            const lingueCompatibili = [];

            for (const [idLingua, nomeLingua] of Object.entries(lingue)) {

                const responseFormati = await fetch(`/gestioneProgrammazione/formatiFilm/${idFilm}/${idLingua}`);

                if (!responseFormati.ok) {
                    continue;
                }

                const formati =await responseFormati.json();


                // 3. Controllo se il formato della sala è presente
                if (formati.includes(formatoSala)) {

                    lingueCompatibili.push({id: idLingua,nome: nomeLingua});
                }
            }


            // -------------------------------------------------
            // 4. Nessuna lingua compatibile
            // -------------------------------------------------

            if (lingueCompatibili.length === 0) {

                linguaSelect.innerHTML = `
                    <option value="" disabled selected>
                        Nessuna lingua disponibile per questa sala
                    </option>
                `;

                linguaSelect.disabled = true;

                resetOrari();

                return;
            }


            // -------------------------------------------------
            // 5. Popolamento dropdown
            // -------------------------------------------------

            linguaSelect.innerHTML = `
                <option value="" disabled selected>
                    Seleziona lingua...
                </option>
            `;

            lingueCompatibili.forEach(lingua => {

                linguaSelect.innerHTML += `
                    <option value="${lingua.id}">
                        ${lingua.nome}
                    </option>
                `;
            });


            linguaSelect.disabled = false;
        } catch (error) {
            console.error("Errore recupero lingue compatibili:", error);

            linguaSelect.innerHTML = `
                <option value="" disabled selected>
                    Errore caricamento lingue
                </option>
            `;

            linguaSelect.disabled = true;
            resetOrari();
        }
    }


    // =========================================================
    // CARICAMENTO FILM
    // =========================================================

    fetch("/inSala/listaFilm")
        .then(response => {
            if (!response.ok) {
                throw new Error(
                    "Errore nel recupero dei film"
                );
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
            console.error("Errore recupero film:",error);
        });


    // =========================================================
    // CARICAMENTO SALE
    // =========================================================

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


            sale.forEach((sala, index) => {

                // Salvo il formato della sala
                saleFormatiMap[sala.id] =
                    sala.formato;


                const radio = `
                    <div class="form-check">

                        <input
                            class="form-check-input"
                            type="radio"
                            name="sala"
                            value="${sala.id}"
                            id="sala-${sala.id}"
                        >

                        <label
                            class="form-check-label"
                            for="sala-${sala.id}">
                            ${sala.nome}
                        </label>

                    </div>
                `;
                if (index % 2 === 0) {
                    col1 += radio;
                } else {
                    col2 += radio;
                }
            });

            col1 += `</div>`;
            col2 += `</div>`;

            saleContainer.innerHTML = col1 + col2;

            // -------------------------------------------------
            // EVENTO CAMBIO SALA
            // -------------------------------------------------

            document.querySelectorAll("#programmazione input[name='sala']").forEach(radio => {
                    radio.addEventListener("change",async function () {
                            const idFilm = filmSelect.value;
                            const formatoSala =  saleFormatiMap[ this.value];


                            // Carica SOLO le lingue
                            // compatibili con questa sala
                            await caricaLingueCompatibili(idFilm,formatoSala);


                            // Gli orari vengono caricati
                            // solo dopo aver scelto
                            // anche la lingua
                            aggiornaOrariBackend();
                        }
                    );
                });

        })

        .catch(error => {
            console.error("Errore recupero sale:", error);
        });


    // =========================================================
    // AGGIORNA STATO SALE
    // =========================================================

    function aggiornaStatoSale(formatiFilm) {

        document.querySelectorAll( "#programmazione input[name='sala']")
            .forEach(radio => {
                const formatoSala = saleFormatiMap[radio.value];
                const label = radio.nextElementSibling;

                // Nessun film selezionato
                if (!formatiFilm ||formatiFilm.length === 0) {
                    radio.disabled = false;
                    label.style.opacity = "";
                    label.title = "";
                    return;
                }


                // Formato non disponibile
                if (!formatiFilm.includes(formatoSala)) {
                    radio.disabled = true;
                    radio.checked = false;
                    label.style.opacity = "0.4";
                    label.title ="Formato non supportato da questo film";
                } else {
                    radio.disabled = false;
                    label.style.opacity = "";
                    label.title = "";
                }
            });
    }


    // =========================================================
    // RECUPERA TUTTI I FORMATI DEL FILM
    // =========================================================

    async function recuperaFormatiFilm(idFilm) {

        const responseLingue =await fetch( `/gestioneProgrammazione/lingueFilm/${idFilm}`);

        if (!responseLingue.ok) {
            throw new Error( "Errore recupero lingue film");
        }

        const lingue = await responseLingue.json();
        const formatiSet = new Set();


        // Per ogni lingua recupero i formati
        for (const idLingua of Object.keys(lingue)) {
            const responseFormati = await fetch(`/gestioneProgrammazione/formatiFilm/${idFilm}/${idLingua}`);
            if (!responseFormati.ok) {
                continue;
            }
            const formati =await responseFormati.json();

            formati.forEach(formato => {
                formatiSet.add(formato);
            });
        }
        return [...formatiSet];
    }


    // =========================================================
    // EVENTO CAMBIO FILM
    // =========================================================

    filmSelect.addEventListener( "change",async function () {
            let idFilm = filmSelect.value;
            // Reset lingua
            resetLingua();
            // Reset orari
            resetOrari();

            if (!idFilm) {
                aggiornaStatoSale(null);
                return;
            }
            try {
                // -------------------------------------------------
                // Recupero tutti i formati utilizzabili dal film
                // -------------------------------------------------
                const formatiFilm = await recuperaFormatiFilm(idFilm);


                // -------------------------------------------------
                // Abilita/disabilita le sale
                // -------------------------------------------------
                aggiornaStatoSale(formatiFilm);


                // -------------------------------------------------
                // Se una sala era già selezionata,
                // ricarico le lingue compatibili
                // -------------------------------------------------

                const radioSala = document.querySelector( "#programmazione input[name='sala']:checked" );

                if (radioSala) {
                    const formatoSala = saleFormatiMap[radioSala.value];
                    await caricaLingueCompatibili( idFilm, formatoSala);
                }


                aggiornaOrariBackend();
            } catch (error) {
                console.error( "Errore recupero formati film:", error);
                aggiornaStatoSale(null);
                resetLingua();
                resetOrari();
            }
        }
    );


    // =========================================================
    // EVENTO CAMBIO DATA
    // =========================================================

    dataInput.addEventListener("change", aggiornaOrariBackend);

    // =========================================================
    // EVENTO CAMBIO LINGUA
    // =========================================================

    linguaSelect.addEventListener("change", function () {
        const linguaSelezionata = linguaSelect.value;

        if (!linguaSelezionata) {
            return;
        }

        // In modifica: il dropdown indica solo la lingua dei NUOVI orari.
        // Gli orari già selezionati mantengono la loro lingua.
        if (modalitaModifica) {
            return;
        }

        // Nuova programmazione: aggiorna la disponibilità
        aggiornaOrariBackend();
    });


    // =========================================================
    // RECUPERA ORARI DAL BACKEND
    // =========================================================

    async function aggiornaOrariBackend() {

        let data = dataInput.value;
        let sala = document.querySelector( "#programmazione input[name='sala']:checked")?.value;
        let lingua = linguaSelect.value;
        let film = filmSelect.value;

        // -------------------------------------------------
        // Servono tutti e quattro i dati
        // -------------------------------------------------

        if ( !film ||  !data || !sala || (!modalitaModifica && !lingua) ) {
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

            // =================================================
            // FETCH 1
            // ORARI OCCUPATI NELLA SALA
            // =================================================

            const responseSala = await fetch(`/gestioneProgrammazione/getOrariPerSala/${sala}/${data}`);

            if (!responseSala.ok) {
                throw new Error( "Errore nel recupero degli orari della sala" );
            }

            const orariSala =  await responseSala.json();


            orariAltriFilm = [];
            durataPerOrario = {};


            Object.entries(orariSala)
                .forEach(([orario, durata]) => {

                    orariAltriFilm.push(orario);
                    durataPerOrario[orario] = Number(durata) || 0;
                });


            // =================================================
            // FETCH 2
            // ORARI DEL FILM CORRENTE
            // =================================================

            if (modalitaModifica) {

                if (!film) {
                    throw new Error("Film non selezionato durante la modifica" );
                }

                const responseFilm =  await fetch( `/gestioneProgrammazione/getOrari/${film}/${sala}/${data}`);
                if (!responseFilm.ok) {
                    throw new Error("Errore nel recupero degli orari del film");
                }

                const orariFilm = await responseFilm.json();
                orariFilmCorrente = Object.keys(orariFilm);


                anteprimaPerOrario = {};
                linguaPerOrario = {};


                // -------------------------------------------------
                // Rimuove dagli occupati gli orari del film corrente
                // -------------------------------------------------
                orariAltriFilm = orariAltriFilm.filter( orario => !orariFilmCorrente.includes(orario) );


                // -------------------------------------------------
                // Durata + anteprima + lingua
                // -------------------------------------------------

                Object.entries(orariFilm).forEach(([orario, dati]) => {
                        durataPerOrario[orario] = Number(dati.durata) || 0;
                        anteprimaPerOrario[orario] =  dati.anteprima === true;

                        if (dati.idLingua != null) {
                            linguaPerOrario[orario] = String(dati.idLingua);
                        }
                    });
            }

            // =================================================
            // PREPARA GLI ORARI
            // =================================================

            preparaOrariDisponibili();


        } catch (error) {
            console.error( "Errore backend orari:", error);
            resetOrari();
        } finally {
            richiestaOrariInCorso = false;
        }
    }


    // =========================================================
    // PREPARA ORARI DISPONIBILI
    // =========================================================

    function preparaOrariDisponibili() {
        let checkboxes = document.querySelectorAll( "#programmazione input[name='orari']" );


        // -------------------------------------------------
        // RESET GRAFICO
        // -------------------------------------------------

        checkboxes.forEach(cb => {

            cb.checked = false;
            cb.disabled = false;

            let contenitore =cb.closest(".form-check");

            if (contenitore) {
                contenitore.classList.remove("is-selected","is-anteprima","is-inglese");
            }

            let label = cb.nextElementSibling;

            if (label) {

                label.style.color = "";
                label.style.textDecoration = "";
                label.style.opacity = "";
                label.title = "";
            }
        });


        // -------------------------------------------------
        // BLOCCA ORARI OCCUPATI
        // -------------------------------------------------

        orariAltriFilm.forEach(orario => {

            let checkbox = [...checkboxes].find(cb => cb.value === orario);

            if (!checkbox) {
                return;
            }

            checkbox.disabled = true;
            let label =checkbox.nextElementSibling;

            if (label) {

                label.style.color = "#999";
                label.style.textDecoration ="line-through";
                label.style.opacity = "0.6";
                label.title ="Orario occupato da un altro film";
            }

            bloccaIntervallo(orario, checkbox);
        });


        // -------------------------------------------------
        // MODIFICA:
        // RIATTIVA ORARI CORRENTI
        // -------------------------------------------------

        if (modalitaModifica) {

            orariFilmCorrente.forEach(orario => {

                const checkbox =[...checkboxes].find(cb => cb.value === orario);

                if (!checkbox) {
                    return;
                }
                checkbox.disabled = false;
                checkbox.checked = true;

                let contenitore = checkbox.closest(".form-check");

                if (contenitore) {
                    contenitore.classList.add("is-selected");
                    if (
                        anteprimaPerOrario[orario] === true
                    ) {
                        contenitore.classList.remove("is-selected");
                        contenitore.classList.add("is-anteprima" );
                    }
                }

                let label = checkbox.nextElementSibling;


                if (label) {
                    label.style.color = "";
                    label.style.textDecoration = "";
                    label.style.opacity = "";

                    label.title ="Orario della programmazione corrente";
                }
            });
        }


        // -------------------------------------------------
        // EVENTI CHECKBOX
        // -------------------------------------------------

        checkboxes.forEach(cb => {

            let contenitore =cb.closest(".form-check");

            if (!contenitore) {
                return;
            }

            contenitore.onclick = function (e) {
                if (cb.disabled) {
                    return;
                }

                e.preventDefault();

                // =============================================
                // STATO 1
                // NON SELEZIONATO → NORMALE
                // =============================================

                if (
                    !contenitore.classList.contains("is-selected") &&
                    !contenitore.classList.contains("is-anteprima")
                ) {

                    if (!linguaSelect.value) {
                        alert( "Seleziona prima la lingua.");
                        return;
                    }

                    cb.checked = true;
                    contenitore.classList.add("is-selected" );
                    anteprimaPerOrario[cb.value] = false;

                    // Associa la lingua all'orario
                    linguaPerOrario[cb.value] =String(linguaSelect.value);
                }


                // =============================================
                // STATO 2
                // NORMALE → ANTEPRIMA
                // =============================================

                else if (
                    contenitore.classList.contains("is-selected")
                ) {

                    // Una sola anteprima
                    document.querySelectorAll("#programmazione .form-check.is-anteprima").forEach(altro => {
                            altro.classList.remove("is-anteprima");
                            let altroCb =altro.querySelector( "input[name='orari']");
                            if (altroCb) {
                                altroCb.checked = false;
                                anteprimaPerOrario[altroCb.value] = false;
                            }
                        });

                    cb.checked = true;
                    contenitore.classList.remove( "is-selected");
                    contenitore.classList.add("is-anteprima" );
                    anteprimaPerOrario[cb.value] =true;
                }


                // =============================================
                // STATO 3
                // ANTEPRIMA → NON SELEZIONATO
                // =============================================

                else if (
                    contenitore.classList.contains("is-anteprima" )
                ) {
                    cb.checked = false;
                    contenitore.classList.remove("is-selected","is-anteprima");
                    anteprimaPerOrario[cb.value] = false;
                    delete linguaPerOrario[cb.value];
                }
                aggiornaBlocchiDurata();
            };
        });
        aggiornaBlocchiDurata();
    }

//    FUNZIONE CHE APPLICA IL COLORE
    function aggiornaColoriLingua() {
        document.querySelectorAll("#programmazione input[name='orari']").forEach(cb => {
            const contenitore = cb.closest(".form-check");
            if (!contenitore) return;
            const attivo = contenitore.classList.contains("is-selected") || contenitore.classList.contains("is-anteprima");
            contenitore.classList.toggle( "is-inglese", attivo && isInglese(linguaPerOrario[cb.value]));
        });
    }

    // =========================================================
    // CONTROLLO DURATA FILM
    // =========================================================

    function aggiornaBlocchiDurata() {

        let checkboxes =  document.querySelectorAll(  "#programmazione input[name='orari']" );
        let filmSelezionato = filmSelect.value;
        let durataFilmSelezionato = Number( durataFilmMap[filmSelezionato]) || 0;


        // -------------------------------------------------
        // RESET DISPONIBILITÀ
        // -------------------------------------------------

        checkboxes.forEach(cb => {
            cb.disabled = orariAltriFilm.includes(cb.value);

            let label = cb.nextElementSibling;
            if (label) {
                if (orariAltriFilm.includes(cb.value)) {
                    // Orario realmente occupato da un altro film
                    label.style.color = "#999";
                    label.style.textDecoration = "line-through";
                    label.style.opacity = "0.6";
                    label.title = "Orario occupato da un altro film";
                } else {
                    // Pulizia: poi bloccaIntervallo ricalcola i blocchi
                    label.style.color = "";
                    label.style.textDecoration = "";
                    label.style.opacity = "";
                    label.title = "";

                    if (modalitaModifica && orariFilmCorrente.includes(cb.value)) {
                        label.title = "Orario della programmazione corrente";
                    }
                }
            }
        });


        // -------------------------------------------------
        // BLOCCA DURATA ALTRI FILM
        // -------------------------------------------------

        orariAltriFilm.forEach(orario => {
            const checkbox =
                [...checkboxes]
                    .find(cb => cb.value === orario);


            if (checkbox) {
                bloccaIntervallo( orario, checkbox);
            }
        });


        // -------------------------------------------------
        // BLOCCA DURATA ORARI SELEZIONATI
        // -------------------------------------------------

        let selezionati =
            [...checkboxes].filter(cb => {

                let contenitore =  cb.closest(".form-check");

                return (
                    contenitore?.classList.contains(  "is-selected") || contenitore?.classList.contains("is-anteprima"));
            });

        selezionati.forEach(cb => {

            durataPerOrario[cb.value] = durataFilmSelezionato;
            bloccaIntervallo(cb.value, cb);
        });
        aggiornaColoriLingua();
    }


    // =========================================================
    // BLOCCA INTERVALLO DURATA FILM
    // =========================================================

    function bloccaIntervallo(orarioSelezionato, checkboxSelezionato) {
        let durata = Number(durataPerOrario[orarioSelezionato]) || 0;

        if (durata <= 0) {
            return;
        }

        // Durata del film che si sta programmando ora
        let durataNuovo = Number(durataFilmMap[filmSelect.value]) || 0;

        let startMin = convertiOraInMinuti(orarioSelezionato);
        let endMin = startMin + durata;
        let checkboxes = document.querySelectorAll("#programmazione input[name='orari']");

        checkboxes.forEach(cb => {
            if (cb === checkboxSelezionato) {
                return;
            }

            // Durante la modifica non blocco
            // gli orari del film corrente
            if (
                modalitaModifica &&
                orariFilmCorrente.includes(cb.value)
            ) {
                return;
            }

            // Non disabilito mai un orario già selezionato,
            // altrimenti non si potrebbe più deselezionare
            let contenitore = cb.closest(".form-check");
            if (
                contenitore?.classList.contains("is-selected") ||
                contenitore?.classList.contains("is-anteprima")
            ) {
                return;
            }

            let currentMin = convertiOraInMinuti(cb.value);
            let label = cb.nextElementSibling;

            // 1) DOPO l'inizio: il film esistente è ancora in corso
            if (currentMin > startMin && currentMin < endMin) {
                cb.disabled = true;

                if (label) {
                    label.style.color = "#999";
                    label.style.opacity = "0.6";
                    label.title = "Orario bloccato dalla durata del film";
                }
                return;
            }

            // 2) PRIMA dell'inizio: il nuovo film finirebbe dopo l'inizio di quello esistente
            if (
                durataNuovo > 0 &&
                currentMin < startMin &&
                currentMin + durataNuovo > startMin
            ) {
                cb.disabled = true;

                if (label) {
                    label.style.color = "#999";
                    label.style.opacity = "0.6";
                    label.title = "Orario bloccato: il film finirebbe dopo l'inizio di un'altra proiezione";
                }
            }
        });
    }


    // =========================================================
    // CONVERSIONE ORARIO → MINUTI
    // =========================================================

    function convertiOraInMinuti(ora) {

        let [ore, minuti] = ora.split(":").map(Number);


        // Gli orari dopo mezzanotte
        // appartengono alla giornata successiva
        if (ore < 11) {
            ore += 24;
        }


        return ore * 60 + minuti;
    }


    // =========================================================
    // RESET COMPLETO
    // =========================================================

    function resetFormProgrammazione() {

        filmSelect.selectedIndex = 0;

        dataInput.value = "";


        document
            .querySelectorAll(
                "#programmazione input[name='sala']"
            )
            .forEach(radio => {

                radio.checked = false;
            });


        resetLingua();
        resetOrari();
        linguaPerOrario = {};
    }


    // =========================================================
    // MODIFICA PROGRAMMAZIONE
    // =========================================================

    async function modificaProgrammazione(
        film,
        sala,
        data
    ) {

        try {

            modalitaModifica = true;


            // -------------------------------------------------
            // FILM
            // -------------------------------------------------

            filmSelect.value = film;


            // -------------------------------------------------
            // DATA
            // -------------------------------------------------

            dataInput.value = data;


            // -------------------------------------------------
            // SALA
            // -------------------------------------------------

            let radioSala =
                document.querySelector(
                    `#programmazione input[name='sala'][value="${sala}"]`
                );


            if (!radioSala) {

                throw new Error(
                    "Sala della programmazione non trovata"
                );
            }


            radioSala.checked = true;


            // -------------------------------------------------
            // CARICA LINGUE COMPATIBILI
            // -------------------------------------------------

            const formatoSala =
                saleFormatiMap[sala];

                if (!formatoSala) {
                    throw new Error(
                        "Formato della sala non trovato"
                    );
                }

                    // -------------------------------------------------
                    // CARICA TUTTE LE PROGRAMMAZIONI
                    // -------------------------------------------------
                    await caricaLingueCompatibili(film, formatoSala);
                    await aggiornaOrariBackend();



                    // -------------------------------------------------
                    // Determina la lingua iniziale del dropdown
                    // -------------------------------------------------

                    const linguePresenti =
                        [
                            ...new Set(
                                Object.values(linguaPerOrario)
                            )
                        ];


                    if (linguePresenti.length === 1) {

                        linguaSelect.value =
                            linguePresenti[0];

                    } else {

                        linguaSelect.value = "";
                    }


                    // -------------------------------------------------
                    // SCROLL
                    // -------------------------------------------------

                    document
                        .getElementById("programmazione")
                        ?.scrollIntoView({
                            behavior: "smooth"
                        });


                } catch (error) {

                    console.error(
                        "Errore modifica programmazione:",
                        error
                    );

                    alert(
                        "Impossibile caricare la programmazione."
                    );
                }
            }


    // =========================================================
    // ELIMINA PROGRAMMAZIONE
    // =========================================================

    async function eliminaProgrammazione(
        film,
        sala,
        data
    ) {

        let conferma =
            confirm(
                "Sei sicuro di voler eliminare questa programmazione?"
            );


        if (!conferma) {
            return;
        }


        try {

            const response =
                await fetch(
                    `/gestioneProgrammazione/cancellaProgrammazione/${film}/${sala}/${data}`,
                    {
                        method: "POST"
                    }
                );


            if (!response.ok) {

                throw new Error(
                    "Errore durante la cancellazione della programmazione"
                );
            }


            alert(
                "Programmazione eliminata correttamente."
            );


            caricaTabellaProgrammazioni();


        } catch (error) {

            console.error(
                "Errore eliminazione programmazione:",
                error
            );

            alert(
                "Si è verificato un errore durante l'eliminazione."
            );
        }
    }


    // =========================================================
    // CARICAMENTO TABELLA
    // =========================================================

    caricaTabellaProgrammazioni();


    // =========================================================
    // SALVATAGGIO PROGRAMMAZIONE
    // =========================================================

    btnConferma.addEventListener(
        "click",
        async function (e) {

            e.preventDefault();


            let film =
                filmSelect.value;

            let data =
                dataInput.value;

            let sala =
                document.querySelector(
                    "#programmazione input[name='sala']:checked"
                )?.value;

            let lingua =
                linguaSelect.value;


            let orariSelezionati =
                [
                    ...document.querySelectorAll(
                        "#programmazione input[name='orari']"
                    )
                ]
                .filter(cb => {

                    let contenitore =
                        cb.closest(".form-check");

                    return (
                        contenitore?.classList.contains(
                            "is-selected"
                        ) ||
                        contenitore?.classList.contains(
                            "is-anteprima"
                        )
                    );
                })
                .map(cb => cb.value);


            // =================================================
            // VALIDAZIONE
            // =================================================

            if (!film || !data || !sala) {
                alert("Seleziona film, data e sala.");
                return;
            }


            if (
                orariSelezionati.length === 0
            ) {

                alert(
                    "Seleziona almeno un orario."
                );

                return;
            }


            try {

                // =================================================
                // MODIFICA PROGRAMMAZIONE
                // =================================================

                if (modalitaModifica) {

                    // =================================================
                    // MODIFICA GRUPPO
                    // Film + Sala + Data
                    // =================================================

                    // -------------------------------------------------
                    // 1. Cancella tutte le programmazioni del gruppo
                    // -------------------------------------------------

                    const responseDelete =
                        await fetch(
                            `/gestioneProgrammazione/cancellaProgrammazione/${film}/${sala}/${data}`,
                            {
                                method: "POST"
                            }
                        );


                    if (!responseDelete.ok) {

                        throw new Error(
                            "Errore durante la cancellazione delle programmazioni"
                        );
                    }


                    // -------------------------------------------------
                    // 2. Ricrea ogni programmazione
                    //    mantenendo la lingua del singolo orario
                    // -------------------------------------------------

                    await Promise.all(

                        orariSelezionati.map(
                            async orario => {

                                const idLingua =
                                    linguaPerOrario[orario];


                                if (!idLingua) {

                                    throw new Error(
                                        `Lingua non definita per l'orario ${orario}`
                                    );
                                }


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

                                                    idFilm:
                                                        film,

                                                    idSala:
                                                        sala,

                                                    idLingua:
                                                        idLingua,

                                                    data:
                                                        data,

                                                    orario:
                                                        orario,

                                                    anteprima:
                                                        anteprimaPerOrario[
                                                            orario
                                                        ] === true
                                                })
                                        }
                                    );


                                if (!response.ok) {

                                    throw new Error(
                                        "Errore durante il salvataggio della programmazione"
                                    );
                                }


                                return response.json();
                            }
                        )
                    );


                    alert(
                        "Programmazione modificata correttamente."
                    );



                } else {

                    // =================================================
                    // NUOVA PROGRAMMAZIONE
                    // =================================================

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

                                                    idFilm:
                                                        film,

                                                    idSala:
                                                        sala,

                                                    idLingua:
                                                        lingua,

                                                    data:
                                                        data,

                                                    orario:
                                                        orario,

                                                    anteprima:
                                                        anteprimaPerOrario[
                                                            orario
                                                        ] === true
                                                })
                                        }
                                    );


                                if (!response.ok) {

                                    throw new Error(
                                        "Errore durante il salvataggio"
                                    );
                                }


                                return response.json();
                            }
                        )
                    );


                    alert(
                        "Programmazione salvata correttamente."
                    );
                }


                // =================================================
                // RESET
                // =================================================

                resetFormProgrammazione();

                modalitaModifica = false;


                // =================================================
                // AGGIORNA TABELLA
                // =================================================

                caricaTabellaProgrammazioni();


            } catch (error) {

                console.error(
                    "Errore programmazione:",
                    error
                );

                alert(
                    "Si è verificato un errore."
                );
            }
        }
    );


    // =========================================================
    // ANNULLA
    // =========================================================

    btnAnnulla.addEventListener(
        "click",
        function () {

            modalitaModifica = false;

            resetFormProgrammazione();
        }
    );


    // =========================================================
    // FUNZIONI GLOBALI
    // =========================================================

    window.modificaProgrammazione =
        modificaProgrammazione;

    window.eliminaProgrammazione =
        eliminaProgrammazione;
}


    // =========================================================
    // |                                                       |
    // |                   FORM UTENTI                         |
    // |                                                       |
    // =========================================================

    let utenteSection = document.getElementById("utenti");

    if (utenteSection) {

        let usernameInput = document.getElementById("username");
        let emailInput = document.getElementById("email");
        let ruoliContainer = document.getElementById("ruoliContainer");

        let modalitaModifica = false;
        let utenteIdModifica = null;


        // =====================================================
        // CONTROLLO ELEMENTI
        // =====================================================

        if (
            !usernameInput ||
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
                    const response = await fetch("/admin/gestioneUtenti/listaRuoli");

                    if (!response.ok) {
                        throw new Error( "Errore nel recupero dei ruoli" );
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
                    console.error("Errore recupero ruoli:",error);
                }
            }


            // =================================================
            // RESET FORM UTENTE
            // =================================================

            function resetFormUtente() {

                usernameInput.value = "";
                emailInput.value = "";

                ruoliContainer.querySelectorAll("input[name='ruolo']").forEach(radio => {
                        radio.checked = false;
                    });

                modalitaModifica = false;
                utenteIdModifica = null;

                utenteSection.dataset.id = "";
            }


            // =================================================
            // MODIFICA UTENTE
            // =================================================

            async function modificaUtente(id) {
                try {
                    const response = await fetch( `/admin/gestioneUtenti/getUtente/${id}` );
                    if (!response.ok) {
                        throw new Error( "Errore nel recupero dell'utente" );
                    }

                    const utente = await response.json();

                    modalitaModifica = true;
                    utenteIdModifica = utente.id;
                    usernameInput.value = utente.username ?? "";
                    emailInput.value = utente.email ?? "";

                    ruoliContainer.querySelectorAll("input[name='ruolo']").forEach(radio => {
                            radio.checked = String(radio.value) === String(utente.idRuolo);
                        });

                    utenteSection.dataset.id = utente.id;

                    showSection("utenti");

                    utenteSection.scrollIntoView({
                        behavior: "smooth"
                    });

                } catch (error) {
                    console.error("Errore modifica utente:",error);
                    alert( "Impossibile caricare l'utente.");
                }
            }


            // =================================================
            // SALVATAGGIO / AGGIORNAMENTO UTENTE
            // =================================================

            async function salvaUtente() {
                let username = usernameInput.value.trim();
                let email = emailInput.value.trim();
                let radioRuolo = ruoliContainer.querySelector("input[name='ruolo']:checked");
                let idRuolo = radioRuolo ? Number(radioRuolo.value) : null;

                // =================================================
                // VALIDAZIONE
                // =================================================
                if (!username || !email || !idRuolo) {
                    alert("Compila username, email e ruolo.");
                    return;
                }


                // =================================================
                // DTO
                // =================================================

                let dto = {
                    id: modalitaModifica
                        ? utenteIdModifica
                        : null,
                    username: username,
                    email: email,
                    idRuolo: idRuolo
                };


                // =================================================
                // INVIO AL BACKEND
                // =================================================

                try {
                    const response = await fetch("/admin/gestioneUtenti/salvaUtente",{
                            method: "POST",
                            headers: {
                                "Content-Type":
                                    "application/json"
                            },
                            body: JSON.stringify(dto)
                        }
                    );


                    // =================================================
                    // RISPOSTA BACKEND
                    // =================================================

                    const risultato = await response.json();

                    if (!response.ok) {
                        alert(risultato.message ||"Si è verificato un errore.");
                        return;
                    }

                    // =================================================
                    // SUCCESSO
                    // =================================================
                    alert( risultato.message);
                    resetFormUtente();
                    caricaTabellaUtenti();
                } catch (error) {
                    console.error("Errore salvataggio utente:",error);
                    alert("Si è verificato un errore durante il salvataggio.");
                }
            }


            // CARICA RUOLI
            caricaRuoli();

            // BOTTONI
            let btnConfermaUtente = document.getElementById("btnConfermaUtente");
            let btnAnnullaUtente = document.getElementById("btnAnnullaUtente");

            // =================================================
            // CONFERMA
            // =================================================

            if (btnConfermaUtente) {
                btnConfermaUtente.addEventListener( "click",function (e) {
                        e.preventDefault();
                        salvaUtente();
                    }
                );
            }


            // =================================================
            // ANNULLA
            // =================================================

            if (btnAnnullaUtente) {
                btnAnnullaUtente.addEventListener("click",function (e) {
                        e.preventDefault();
                        resetFormUtente();
                    }
                );
            }


            // ESPONI MODIFICA
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