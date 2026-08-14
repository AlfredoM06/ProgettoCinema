document.addEventListener("DOMContentLoaded", function () {

    // =========================================================
    // SIDEBAR
    // =========================================================

    let buttons = document.querySelectorAll(".menu-btn");
    let sections = document.querySelectorAll(".content-section");

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
    ) {

        console.error("Elementi programmazione mancanti:", {
            programmazioneForm,
            filmSelect,
            dataInput,
            saleContainer,
            orariContainer
        });

        return;
    }

    let btnConferma = programmazioneForm.querySelector("button[type='submit']");
    let btnAnnulla = programmazioneForm.querySelector("button[type='reset']");


    // =========================================================
    // STATO PROGRAMMAZIONE
    // =========================================================

    let richiestaOrariInCorso = false;
    // Orari occupati dagli altri film
    let orariAltriFilm = [];
    // Orari della programmazione attualmente modificata
    let orariFilmCorrente = [];
    // Durata associata agli orari
    let durataPerOrario = {};
    // Durata dei film
    const durataFilmMap = {};
    // Modalità modifica
    let modalitaModifica = false;


    // =========================================================
    // GENERAZIONE ORARI
    // Ogni 10 minuti
    // Dalle 11:00 alle 01:00
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

        document
            .querySelectorAll("#programmazione input[name='orari']").forEach(cb => {
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
                durataFilmMap[film.id] = film.durata;
            });
        })
        .catch(error => {
            console.error(
                "Errore recupero film:",
                error
            );
        });


    // =========================================================
    // CARICAMENTO SALE
    // =========================================================

    fetch("/inSala/listaSale")
        .then(response => {
            if (!response.ok) {
                throw new Error(
                    "Errore nel recupero delle sale"
                );
            }
            return response.json();
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

            saleContainer.innerHTML = col1 + col2;

            document.querySelectorAll("#programmazione input[name='sala']").forEach(radio => {
                    radio.addEventListener("change", aggiornaOrariBackend);
                });
        })
        .catch(error => {
            console.error( "Errore recupero sale:", error);
        });


    // =========================================================
    // EVENTI FILM / DATA
    // =========================================================

    filmSelect.addEventListener( "change", aggiornaOrariBackend);
    dataInput.addEventListener("change", aggiornaOrariBackend);

    // =========================================================
    // AGGIORNA ORARI DAL BACKEND
    // =========================================================

    async function aggiornaOrariBackend() {
        let data = dataInput.value;
        let sala =document.querySelector("#programmazione input[name='sala']:checked") ?.value;

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

            const responseSala = await fetch(`/gestioneProgrammazione/getOrariPerSala/${sala}/${data}`);

            if (!responseSala.ok) {
                throw new Error(
                    "Errore nel recupero degli orari della sala"
                );
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


            // =====================================================
            // FETCH 2
            // ORARI DEL FILM CORRENTE
            // SOLO IN MODIFICA
            // =====================================================

            if (modalitaModifica) {

                let film = filmSelect.value;

                if (!film) {
                    throw new Error("Film non selezionato durante la modifica" );
                }

                const responseFilm =await fetch(`/gestioneProgrammazione/getOrari/${film}/${sala}/${data}`);

                if (!responseFilm.ok) {
                    throw new Error("Errore nel recupero degli orari del film");
                }

                const orariFilm =await responseFilm.json();
                orariFilmCorrente =Object.keys(orariFilm);


                // Rimuove gli orari del film corrente
                // dalla lista degli orari occupati

                orariAltriFilm = orariAltriFilm.filter(orario =>!orariFilmCorrente.includes(orario));


                // Salva le durate degli orari correnti

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
        let checkboxes = document.querySelectorAll( "#programmazione input[name='orari']" );


        // =====================================================
        // RESET
        // =====================================================

        checkboxes.forEach(cb => {

            cb.checked = false;
            cb.disabled = false;

            let label = cb.nextElementSibling;

            if (label) {
                label.style.color = "";
                label.style.textDecoration = "";
                label.style.opacity = "";
                label.title = "";
            }
        });


        // =====================================================
        // BLOCCA ORARI OCCUPATI DA ALTRI FILM
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
                label.style.textDecoration = "line-through";
                label.style.opacity = "0.6";
                label.title =
                    "Orario occupato da un altro film";
            }

            bloccaIntervallo( orario, checkbox );
        });


        // =====================================================
        // IN MODIFICA:
        // RIATTIVA GLI ORARI DEL FILM CORRENTE
        // =====================================================

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

                const label = checkbox.nextElementSibling;

                if (label) {

                    label.style.color = "";
                    label.style.textDecoration = "";
                    label.style.opacity = "";
                    label.title =
                        "Orario della programmazione corrente";
                }
            });
        }


        // =====================================================
        // EVENTI CHECKBOX
        // =====================================================

        checkboxes.forEach(cb => {
            cb.onchange = () => {
                aggiornaBlocchiDurata();
            };
        });

        aggiornaBlocchiDurata();
    }


    // =========================================================
    // CONTROLLO DURATA FILM
    // =========================================================

    function aggiornaBlocchiDurata() {

        let checkboxes = document.querySelectorAll("#programmazione input[name='orari']");
        let filmSelezionato = filmSelect.value;
        let durataFilmSelezionato = Number(durataFilmMap[filmSelezionato]) || 0;


        // =====================================================
        // RESET DISPONIBILITÀ
        // =====================================================

        checkboxes.forEach(cb => {
            if (orariAltriFilm.includes(cb.value)) {
                cb.disabled = true;
            } else {
                cb.disabled = false;
            }
        });


        // =====================================================
        // BLOCCA DURATA DEGLI ALTRI FILM
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
        // BLOCCA DURATA DEGLI ORARI SELEZIONATI
        // =====================================================

        let selezionati =
            [...checkboxes].filter(
                cb => cb.checked
            );

        selezionati.forEach(cb => {
            durataPerOrario[cb.value] = durataFilmSelezionato;
            bloccaIntervallo( cb.value,  cb );
        });
    }


    // =========================================================
    // BLOCCA INTERVALLO DEL FILM
    // =========================================================

    function bloccaIntervallo( orarioSelezionato, checkboxSelezionato) {

        let durata = Number(durataPerOrario[orarioSelezionato]) || 0;

        if (durata <= 0) {
            return;
        }

        let startMin = convertiOraInMinuti(orarioSelezionato);
        let endMin = startMin + durata;
        let checkboxes = document.querySelectorAll("#programmazione input[name='orari']" );

        checkboxes.forEach(cb => {

            if (cb === checkboxSelezionato) {
                return;
            }


            // =================================================
            // NON BLOCCARE GLI ORARI DEL FILM CORRENTE
            // DURANTE LA MODIFICA
            // =================================================

            if (
                modalitaModifica &&
                orariFilmCorrente.includes(cb.value)
            ) {
                return;
            }


            let currentMin = convertiOraInMinuti(cb.value);


            // =================================================
            // ORARIO INTERNO ALLA DURATA
            // =================================================

            if (
                currentMin > startMin &&
                currentMin < endMin
            ) {

                cb.disabled = true;

                let label =  cb.nextElementSibling;

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
    // CLICK MODIFICA / ELIMINA
    // =========================================================

    document.addEventListener("click", function (e) {

        let editBtn = e.target.closest( ".btn-edit-programmazione" );

        if (editBtn) {

            modificaProgrammazione(
                editBtn.dataset.film,
                editBtn.dataset.sala,
                editBtn.dataset.data
            );
            return;
        }

        let deleteBtn = e.target.closest(".btn-delete-programmazione");

        if (deleteBtn) {
            eliminaProgrammazione(
                deleteBtn.dataset.film,
                deleteBtn.dataset.sala,
                deleteBtn.dataset.data
            );
        }
    });


    // =========================================================
    // CONVERSIONE HH:MM -> MINUTI
    // =========================================================

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


    // =========================================================
    // RESET COMPLETO FORM
    // =========================================================

    function resetFormProgrammazione() {

        filmSelect.selectedIndex = 0;
        dataInput.value = "";

        document .querySelectorAll( "#programmazione input[name='sala']" ).forEach(radio => {
                radio.checked = false;
            });
        resetOrari();
    }


    // =========================================================
    // MODIFICA PROGRAMMAZIONE
    // =========================================================

    async function modificaProgrammazione( film,sala, data ) {

        try {

            // =====================================================
            // ATTIVA MODALITÀ MODIFICA
            // =====================================================

            modalitaModifica = true;


            // =====================================================
            // FILM
            // =====================================================

            filmSelect.value = film;


            // =====================================================
            // DATA
            // =====================================================

            dataInput.value = data;


            // =====================================================
            // SALA
            // =====================================================

            let radioSala = document.querySelector(`#programmazione input[name='sala'][value="${sala}"]`);

            if (!radioSala) {
                throw new Error( "Sala della programmazione non trovata");
            }

            radioSala.checked = true;


            // =====================================================
            // CARICA ORARI
            // =====================================================

            await aggiornaOrariBackend();


            // =====================================================
            // SELEZIONA GLI ORARI ATTUALI
            // =====================================================

            document.querySelectorAll( "#programmazione input[name='orari']" ).forEach(cb => {
                    cb.checked =orariFilmCorrente.includes(cb.value);
                });


            aggiornaBlocchiDurata();


            // =====================================================
            // PORTA L'UTENTE AL FORM
            // =====================================================

            document.getElementById("programmazione")?.scrollIntoView({
                    behavior: "smooth"
                });

        } catch (error) {
            console.error("Errore modifica programmazione:", error);
            alert( "Impossibile caricare la programmazione.");
        }
    }


    // =========================================================
    // ELIMINA PROGRAMMAZIONE
    // =========================================================

    async function eliminaProgrammazione(film,sala, data ) {

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

                throw new Error( "Errore durante la cancellazione della programmazione");
            }
            alert( "Programmazione eliminata correttamente." );

            caricaTabellaProgrammazioni();

        } catch (error) {

            console.error("Errore eliminazione programmazione:", error );
            alert( "Si è verificato un errore durante l'eliminazione.");
        }
    }


    // =========================================================
    // CARICA TABELLA PROGRAMMAZIONI
    // =========================================================

    caricaTabellaProgrammazioni();


    // =========================================================
    // SALVA PROGRAMMAZIONE
    // =========================================================

    btnConferma.addEventListener(
        "click",
        async function (e) {

            e.preventDefault();

            let film = filmSelect.value;
            let data =  dataInput.value;
            let sala =  document.querySelector("#programmazione input[name='sala']:checked")?.value;

            let orariSelezionati =
                [
                    ...document.querySelectorAll(
                        "#programmazione input[name='orari']:checked"
                    )
                ].map(cb => cb.value);


            // =====================================================
            // VALIDAZIONE
            // =====================================================

            if (!film || !data || !sala) {
                alert("Seleziona film, data e sala.");
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
                    // 1. CANCELLA PROGRAMMAZIONE ESISTENTE
                    // =============================================

                    const responseDelete = await fetch(`/gestioneProgrammazione/cancellaProgrammazione/${film}/${sala}/${data}`,
                            {
                                method: "POST"
                            }
                        );

                    if (!responseDelete.ok) {

                        throw new Error("Errore durante la cancellazione delle programmazioni" );
                    }


                    // =============================================
                    // 2. RICREA LE PROGRAMMAZIONI
                    // =============================================

                    await Promise.all( orariSelezionati.map(async orario => {

                                let response = await fetch("/gestioneProgrammazione/salvaProgrammazione",
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
                } else {

                    // =================================================
                    // CREAZIONE NUOVA PROGRAMMAZIONE
                    // =================================================

                    await Promise.all(orariSelezionati.map(async orario => {

                                const response = await fetch("/gestioneProgrammazione/salvaProgrammazione",
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

                console.error("Errore programmazione:",error);

                alert("Si è verificato un errore." );
            }
        }
    );


    // =========================================================
    // ANNULLA MODIFICA / RESET
    // =========================================================

    btnAnnulla.addEventListener("click",function () {

            modalitaModifica = false;
            resetFormProgrammazione();
        }
    );

});