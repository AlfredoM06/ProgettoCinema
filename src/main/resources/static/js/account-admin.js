document.addEventListener("DOMContentLoaded", function () {

    // =========================================================
    // SIDEBAR
    // =========================================================

    let buttons = document.querySelectorAll(".menu-btn");
    let sections = document.querySelectorAll(".content-section");


    function clearSidebarActive() {
        document.querySelectorAll(".menu-btn").forEach(btn =>
            btn.classList.remove("active")
        );

        document.querySelectorAll(".dropdown-toggle-admin").forEach(btn =>
            btn.classList.remove("active")
        );
    }


    function closeDropdowns() {
        document.querySelectorAll(".dropdown-admin")
            .forEach(dropdown => {
                dropdown.classList.remove("open");
            });
    }


    function showSection(target) {

        sections.forEach(sec => {
            sec.style.display = "none";
        });

        let activeSection = document.getElementById(target);

        if (activeSection) {
            activeSection.style.display = "block";
        }

        clearSidebarActive();

        let btn = document.querySelector(`[data-target="${target}"]`);

        if (btn) {

            btn.classList.add("active");

            if (btn.closest(".dropdown-menu-admin")) {

                let dropdownParent = btn
                    .closest(".dropdown-admin")
                    .querySelector(".dropdown-toggle-admin");

                dropdownParent.classList.add("active");

            } else {
                closeDropdowns();
            }
        }
    }


    buttons.forEach(btn => {
        btn.addEventListener("click", () => {
            showSection(btn.dataset.target);
        });

    });


    document.querySelectorAll(".edit-btn")
        .forEach(btn => {

            btn.addEventListener("click", () => {
                showSection("profile");
            });

        });


    document.querySelectorAll(".dropdown-toggle-admin")
        .forEach(btn => {

            btn.addEventListener("click", () => {

                let dropdown = btn.closest(".dropdown-admin");
                let isOpen = dropdown.classList.contains("open");

                clearSidebarActive();

                if (!isOpen) {
                    btn.classList.add("active");
                }

                dropdown.classList.toggle("open");
            });

        });


    // =========================================================
    // ELEMENTI PROGRAMMAZIONE
    // =========================================================

    let programmazioneForm = document.querySelector("#programmazione");
    let filmSelect = document.getElementById("filmSalaProgrammazione");
    let dataInput = document.getElementById("dataProgrammazione");
    let saleContainer = document.getElementById("saleContainer");
    let orariContainer = document.querySelector("#programmazione .orari-grid");

    if (
        !programmazioneForm ||
        !filmSelect ||
        !dataInput ||
        !saleContainer ||
        !orariContainer
    )
     {console.log("programmazioneForm:", programmazioneForm);
              console.log("filmSelect:", filmSelect);
              console.log("dataInput:", dataInput);
              console.log("saleContainer:", saleContainer);
              console.log("orariContainer:", orariContainer);
        return;
    }


    // =========================================================
    // VARIABILI PROGRAMMAZIONE
    // =========================================================

    let richiestaOrariInCorso = false;
    // Orari occupati dagli ALTRI film
    let orariAltriFilm = [];
    // Orari della programmazione che stiamo modificando
    let orariFilmCorrente = [];
    // Durata associata agli orari restituiti dal backend
    let durataPerOrario = {};
    //    Lista film
    let durataFilmMap = {};

    // =========================================================
    // STATO MODIFICA
    // =========================================================

    let modalitaModifica = false;
    let programmazioneIdModifica = null;

    // =========================================================
    // GENERAZIONE ORARI
    // ogni 10 minuti
    // =========================================================

    function generaOrari() {

        orariContainer.innerHTML = "";

        let start = 11 * 60;
        let end = 25 * 60;

        for (let minuti = start; minuti <= end; minuti += 10) {

            let ore = Math.floor(minuti / 60);
            let min = minuti % 60;

            if (ore >= 24) {
                ore -= 24;
            }

            let oraFormattata = String(ore).padStart(2, "0") + ":" + String(min).padStart(2, "0");

            orariContainer.innerHTML += `
                <div class="form-check">

                    <input
                        class="form-check-input"
                        type="checkbox"
                        name="orari"
                        value="${oraFormattata}"
                        id="ora-${oraFormattata.replace(":", "-")}"
                        disabled
                    >

                    <label
                        class="form-check-label"
                        for="ora-${oraFormattata.replace(":", "-")}">
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

        document.querySelectorAll("#programmazione input[name='orari']").forEach(cb => {

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


    // =========================================================
    // GET DEI FILM
    // =========================================================

    fetch("/inSala/listaFilm")
        .then(res => {
            if (!res.ok) {
                throw new Error(
                    "Errore nel recupero dei film"
                );
            }
            return res.json();
        })

        .then(films => {
            filmSelect.innerHTML = `
                <option value="" disabled selected>
                    Seleziona film
                </option>
            `;

             // ← ora films è una lista di oggetti, non una mappa
                     films.forEach(film => {
                         filmSelect.innerHTML += `
                             <option value="${film.id}">
                                 ${film.titolo}
                             </option>
                         `;
                         // ← salvi la durata per ogni film
                         durataFilmMap[film.id] = film.durata;
                     });
                 })
                 .catch(error => {
                     console.error("Errore recupero film:", error);
                 });


    // =========================================================
    // GET DELLE SALE
    // =========================================================

    fetch("/inSala/listaSale")

        .then(res => {
            if (!res.ok) {
                throw new Error(
                    "Errore nel recupero delle sale"
                );
            }
            return res.json();
        })

        .then(sale => {
            saleContainer.innerHTML = "";

            let col1 = `<div class="col-6">`;
            let col2 = `<div class="col-6">`;


            Object.entries(sale).forEach(
                        ([idSala, nomeSala], index) => {

                            let radio = `
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

            document.querySelectorAll(
                "#programmazione input[name='sala']"
            ).forEach(radio => {

                radio.addEventListener(
                    "change",
                    aggiornaOrariBackend
                );

            });

        })
        .catch(error => {
            console.error(
                "Errore recupero sale:",
                error
            );

        });


    // =========================================================
    // EVENTI FILM / DATA
    // =========================================================

    filmSelect.addEventListener("change",aggiornaOrariBackend);

    dataInput.addEventListener("change",aggiornaOrariBackend);

    // =========================================================
    // AGGIORNA ORARI DAL BACKEND
    //
    // PRIMA FETCH:
    // Serve sia per CREA che per MODIFICA.
    // Restituisce gli orari occupati nella sala.
    // =========================================================

    async function aggiornaOrariBackend() {

        let data = dataInput.value;
        let sala = document.querySelector("#programmazione input[name='sala']:checked")?.value;

        if (!data || !sala) {
            resetOrari();
            return;
        }

        if (richiestaOrariInCorso) {
            return;
        }

        richiestaOrariInCorso = true;
        resetOrari();

        try {

            // =====================================================
            // FETCH 1
            // ORARI OCCUPATI NELLA SALA
            // =====================================================

            let responseSala = await fetch(`/gestioneProgrammazione/getOrariPerSala/${sala}/${data}`);

            if (!responseSala.ok) {
                throw new Error(
                    "Errore nel recupero degli orari della sala"
                );
            }

            let orariSala = await responseSala.json();

            orariAltriFilm = [];
            durataPerOrario = {};


            Object.entries(orariSala).forEach(
                ([orario, durata]) => {

                    orariAltriFilm.push(orario);

                    durataPerOrario[orario] =
                        Number(durata) || 0;

                }
            );


            // =====================================================
            // SE MODIFICA
            //
            // FACCIAMO LA SECONDA FETCH:
            // Questa restituisce gli orari del film corrente.
            // =====================================================

            if (modalitaModifica) {
                let film = filmSelect.value;

                if (!film) {
                    throw new Error(
                        "Film non selezionato durante la modifica"
                    );
                }

                let responseFilm = await fetch(`/gestioneProgrammazione/getOrari/${film}/${sala}/${data}`);

                if (!responseFilm.ok) {
                    throw new Error("Errore nel recupero degli orari del film");
                }

                let orariFilm = await responseFilm.json();
                orariFilmCorrente = Object.keys(orariFilm);


                /*
                 * Gli orari del film che stiamo modificando
                 * NON devono essere considerati occupati.
                 *
                 * Li rimuoviamo quindi dagli orari degli
                 * altri film.
                 */

                orariAltriFilm = orariAltriFilm.filter(orario => !orariFilmCorrente.includes(orario));

                /*
                 * Aggiungiamo anche le durate degli orari
                 * del film corrente.
                 */

                Object.entries(orariFilm).forEach(
                    ([orario, durata]) => {

                        durataPerOrario[orario] =
                            Number(durata) || 0;

                    }
                );
            }

            preparaOrariDisponibili();

        } catch (error) {
            console.error("Errore backend orari:",error);
            resetOrari();
        } finally {
            richiestaOrariInCorso = false;
        }
    }


    // =========================================================
    // PREPARAZIONE ORARI DISPONIBILI
    // =========================================================

    function preparaOrariDisponibili() {
        let checkboxes = document.querySelectorAll(  "#programmazione input[name='orari']");

        // =====================================================
        // RESET
        // =====================================================

        checkboxes.forEach(cb => {

            let label = cb.nextElementSibling;
            cb.checked = false;
            cb.disabled = false;

            if (label) {

                label.style.color = "";
                label.style.textDecoration = "";
                label.style.opacity = "";
                label.title = "";
            }

        });


        // =====================================================
        // BLOCCA GLI ORARI OCCUPATI DAGLI ALTRI FILM
        // =====================================================

        orariAltriFilm.forEach(orario => {

            let checkbox =
                [...checkboxes].find(
                    cb => cb.value === orario
                );


            if (!checkbox) {
                return;
            }

            checkbox.disabled = true;
            let label = checkbox.nextElementSibling;

            if (label) {

                label.style.color = "#999";
                label.style.textDecoration =
                    "line-through";
                label.style.opacity = "0.6";

                label.title =
                    "Orario occupato da un altro film";
            }


            // =================================================
            // BLOCCA ANCHE GLI SLOT SUCCESSIVI
            // IN BASE ALLA DURATA
            // =================================================

            bloccaIntervallo( orario, checkbox);

        });


        /*
         * In modifica gli orari del film corrente
         * devono rimanere selezionabili.
         */

        if (modalitaModifica) {
            orariFilmCorrente.forEach(orario => {

                let checkbox =
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
                    label.title = "Orario della programmazione corrente";
                }
            });
        }


        // =====================================================
        // EVENTO CAMBIO CHECKBOX
        // =====================================================

        checkboxes.forEach(cb => {

            cb.onchange = function () {
                aggiornaBlocchiDurata();
            };
        });


        aggiornaBlocchiDurata();
    }


    // =========================================================
    // CONTROLLO DURATA
    // =========================================================

    function aggiornaBlocchiDurata() {

        let checkboxes = document.querySelectorAll("#programmazione input[name='orari']");
        let filmSelezionato = filmSelect.value;
        let durataFilmSelezionato = durataFilmMap[filmSelezionato] || 0;

        // =====================================================
        // RIPRISTINO
        //
        // Prima ripristiniamo tutti gli orari liberi.
        // Gli orari degli altri film rimangono bloccati.
        // =====================================================

        checkboxes.forEach(cb => {

            if (orariAltriFilm.includes(cb.value)) {
                cb.disabled = true;
            } else {
                cb.disabled = false;
            }
        });


        // =====================================================
        // BLOCCO INTERVALLI DEGLI ORARI OCCUPATI
        //
        // un orario già occupato blocca anche gli slot
        // successivi in base alla durata del film.
        // =====================================================

        orariAltriFilm.forEach(orario => {
            let checkbox =
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


        // =====================================================
        // BLOCCO INTERVALLI DEGLI ORARI SELEZIONATI
        // DALL'UTENTE
        // =====================================================

        let selezionati = [...checkboxes].filter(cb => cb.checked);
        selezionati.forEach(cb => {
                durataPerOrario[cb.value] = durataFilmSelezionato;
                bloccaIntervallo(cb.value, cb);
            });
    }


    // =========================================================
    // BLOCCA INTERVALLO DEL FILM
    // =========================================================

    function bloccaIntervallo(
        orarioSelezionato,
        checkboxSelezionato
    ) {

        let durata = durataPerOrario[orarioSelezionato];


        if (!durata || durata <= 0) {
            return;
        }

        let startMin = convertiOraInMinuti(orarioSelezionato);
        let endMin = startMin + durata;
        let checkboxes = document.querySelectorAll("#programmazione input[name='orari']");


        checkboxes.forEach(cb => {

            if (cb === checkboxSelezionato) {
                return;
            }

            // =================================================
            // NON TOCCHIAMO GLI ORARI DEL FILM CORRENTE
            // DURANTE LA MODIFICA
            // =================================================

            if ( modalitaModifica && orariFilmCorrente.includes(cb.value)) {
                return;
            }


            let currentMin = convertiOraInMinuti(cb.value);

            /*
             * Gli orari compresi nell'intervallo
             * del film vengono bloccati.
             */

            if ( currentMin > startMin && currentMin < endMin) {

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


    // =========================================================
    // CLICK MODIFICA
    // =========================================================

    document.addEventListener("click", function (e) {

            let button = e.target.closest( ".btn-edit-programmazione" );

            if (!button) {
                return;
            }

            let id = button.dataset.id;

            modificaProgrammazione(id);
        }
    );


    // =========================================================
    // CONVERSIONE HH:MM -> MINUTI
    // =========================================================

    function convertiOraInMinuti(ora) {

        let [ore, minuti] = ora.split(":").map(Number);


        /*
         * Gli orari dopo mezzanotte vengono considerati
         * appartenenti alla giornata successiva.
         */

        if (ore < 11) {
            ore += 24;
        }

        return ore * 60 + minuti;
    }


    // =========================================================
    // RESET COMPLETO FORM
    // =========================================================

    function resetFormProgrammazione() {

        filmSelect.selectedIndex = 0;
        dataInput.value = "";

        document.querySelectorAll("#programmazione input[name='sala']").forEach(radio => {
            radio.checked = false;
        });

        resetOrari();
    }


    // =========================================================
    // MODIFICA PROGRAMMAZIONE
    // =========================================================

    async function modificaProgrammazione(id) {

        try {

            // =====================================================
            // RECUPERO PROGRAMMAZIONE
            // =====================================================

            let response = await fetch( `/api/programmazione/${id}` );

            if (!response.ok) {
                throw new Error("Errore nel recupero della programmazione");
            }

            let programmazione = await response.json();

            // =====================================================
            // ATTIVA MODALITÀ MODIFICA
            // =====================================================

            modalitaModifica = true;
            programmazioneIdModifica = programmazione.id;

            // FILM
            filmSelect.value = programmazione.filmId;

            // DATA
            dataInput.value = programmazione.data;

            // =====================================================
            // SALA
            // =====================================================

            let radioSala = document.querySelector(`#programmazione input[name='sala'][value="${programmazione.sala}"]`);


            if (!radioSala) {
                throw new Error( "Sala della programmazione non trovata");
            }

            radioSala.checked = true;


            // =====================================================
            // CARICA ORARI
            // aggiornaOrariBackend farà:
            // =====================================================

            await aggiornaOrariBackend();

            // =====================================================
            // SELEZIONA GLI ORARI ATTUALI
            // =====================================================

            document.querySelectorAll( "#programmazione input[name='orari']").forEach(cb => {
                cb.checked = orariFilmCorrente.includes( cb.value );
            });

            // Ricalcola i blocchi
            aggiornaBlocchiDurata();


            // =====================================================
            // PORTA L'UTENTE AL FORM
            // =====================================================

            document.getElementById("programmazione")?.scrollIntoView({
                    behavior: "smooth"
                });
        } catch (error) {
            console.error("Errore modifica programmazione:", error );
            alert("Impossibile caricare la programmazione.");
        }
    }


    // =========================================================
    // SUBMIT PROGRAMMAZIONE
    // =========================================================

    programmazioneForm.addEventListener("submit",async function (e) {
            e.preventDefault();

            let film = filmSelect.value;
            let data = dataInput.value;
            let sala = document.querySelector("#programmazione input[name='sala']:checked")?.value;
            let orariSelezionati = [...document.querySelectorAll("#programmazione input[name='orari']:checked")].map(
                    cb => cb.value
                );


            // =====================================================
            // VALIDAZIONE
            // =====================================================

            if (!film || !data || !sala) {
                alert( "Seleziona film, data e sala.");
                return;
            }

            if (orariSelezionati.length === 0) {
                alert("Seleziona almeno un orario.");
                return;
            }
            try {
                // =================================================
                // MODIFICA
                // =================================================

                if (modalitaModifica) {
                    // =============================================
                    // 1. CANCELLA PROGRAMMAZIONI DEL FILM
                    // =============================================

                    let responseDelete =
                    await fetch(`/gestioneProgrammazione/cancellaProgrammazione/${film}/${sala}/${data}`,
                            {
                                method: "POST"
                            }
                        );

                    if (!responseDelete.ok) {
                        throw new Error(
                            "Errore durante la cancellazione delle programmazioni"
                        );
                    }
                    // =============================================
                    // 2. RICREA LE PROGRAMMAZIONI
                    // =============================================

                    await Promise.all(
                        orariSelezionati.map(async orario => {

                            let response = await fetch(
                                "/gestioneProgrammazione/salvaProgrammazione",
                                {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json"
                                    },
                                    body: JSON.stringify({
                                        idFilm: film,
                                        idSala: sala,
                                        data: data,
                                        orario: orario
                                    })
                                }
                            );

                            if (!response.ok) {
                                throw new Error(
                                    "Errore durante il salvataggio della programmazione"
                                );
                            }

                            return response.json();
                        })
                    );
                    alert("Programmazione modificata correttamente.");
                } else {
                    // =================================================
                    // CREA
                    // =================================================

                    await Promise.all(orariSelezionati.map(async orario => {
                                let response = await fetch("/gestioneProgrammazione/salvaProgrammazione", {
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


                // =================================================
                // RESET
                // =================================================

                resetFormProgrammazione();
                modalitaModifica = false;
                programmazioneIdModifica = null;

                // =================================================
                // AGGIORNA TABELLA
                // =================================================

                caricaTabellaProgrammazioni();
            } catch (error) {
                console.error( "Errore programmazione:", error );
                alert("Si è verificato un errore.");
            }
        }
    );


    // =========================================================
    // ANNULLA
    // =========================================================

    programmazioneForm.addEventListener( "reset",function () {
            setTimeout(() => {
                modalitaModifica = false;
                programmazioneIdModifica = null;
                resetFormProgrammazione();
            }, 0);
        }
    );
});
