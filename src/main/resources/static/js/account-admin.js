```javascript
document.addEventListener("DOMContentLoaded", function () {

    // =========================================================
    // SIDEBAR
    // =========================================================

    let buttons = document.querySelectorAll(".menu-btn");
    let sections = document.querySelectorAll(".content-section");


    function clearSidebarActive() {
        document.querySelectorAll(".menu-btn").forEach(btn =>
        btn.classList.remove("active"));

        document.querySelectorAll(".dropdown-toggle-admin").forEach(btn =>
        btn.classList.remove("active"));
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

    let programmazioneForm = document.querySelector("#programmazione form");
    let filmSelect = document.getElementById("filmSalaProgrammazione");
    let dataInput = document.getElementById("dataProgrammazione");
    let saleContainer = document.getElementById("saleContainer");
    let orariContainer = document.querySelector("#programmazione .orari-grid");

    // Se il form programmazione non esiste,
    // non eseguiamo il resto del codice.
    if (
        !programmazioneForm ||
        !filmSelect ||
        !dataInput ||
        !saleContainer ||
        !orariContainer
    ) {
        return;
    }

    // =========================================================
    // VARIABILI PROGRAMMAZIONE
    // =========================================================
    let richiestaOrariInCorso = false;
    let orariAltriFilm = [];
    let orariFilmCorrente = [];
    let durataPerOrario = {};

    // =========================================================
    // STATO MODIFICA
    // =========================================================

    let modalitaModifica = false;
    let programmazioneIdModifica = null;
    let orariOriginaliModifica = [];

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

            let oraFormattata =
                String(ore).padStart(2, "0")
                + ":"
                + String(min).padStart(2, "0");

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

        document.querySelectorAll(
            "#programmazione input[name='orari']"
        ).forEach(cb => {

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
    // GET FILM
    // =========================================================

    fetch("/api/film")

        .then(res => {
            if (!res.ok) {
                throw new Error("Errore nel recupero dei film");
            }
            return res.json();
        })

        .then(films => {
            filmSelect.innerHTML = `
                <option value="" disabled selected>
                    Seleziona film...
                </option>
            `;

            films.forEach(film => {
                filmSelect.innerHTML += `
                    <option value="${film.id}">
                        ${film.titolo}
                    </option>
                `;
            });
        })
        .catch(error => {
            console.error("Errore recupero film:", error);
        });


    // =========================================================
    // GET SALE
    // =========================================================

    fetch("/api/sale")
        .then(res => {
            if (!res.ok) {
                throw new Error("Errore nel recupero delle sale");
            }
            return res.json();
        })
        .then(sale => {
            saleContainer.innerHTML = "";

            let col1 = `<div class="col-6">`;
            let col2 = `<div class="col-6">`;

            sale.forEach((sala, index) => {
                let radio = `
                    <div class="form-check">
                        <input
                            class="form-check-input"
                            type="radio"
                            name="sala"
                            value="${sala.numero}"
                            id="sala-${sala.numero}"
                        >

                        <label
                            class="form-check-label"
                            for="sala-${sala.numero}">
                            Sala ${sala.numero}
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

            // Le sale sono state create dinamicamente,
            // quindi ora possiamo collegare gli eventi.
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
            console.error("Errore recupero sale:", error);
        });


    // =========================================================
    // EVENTI FILM / DATA
    // =========================================================

    filmSelect.addEventListener("change",aggiornaOrariBackend);
    dataInput.addEventListener("change",aggiornaOrariBackend);

    // =========================================================
    // AGGIORNA ORARI DAL BACKEND
    // =========================================================

    function aggiornaOrariBackend() {
        let film = filmSelect.value;
        let data = dataInput.value;
        let sala =document.querySelector("#programmazione input[name='sala']:checked")?.value;

        // Finché non abbiamo tutti e 3 i valori
        // gli orari rimangono disabilitati.
        if (!film || !data || !sala) {
            resetOrari();
            return;
        }
        // Evita richieste duplicate contemporanee.
        if (richiestaOrariInCorso) {
            return;
        }
        richiestaOrariInCorso = true;
        resetOrari();

        return fetch("/api/programmazione/check", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({

                filmId: film,
                data: data,
                sala: sala

            })
        })
        .then(res => {
            if (!res.ok) {
                throw new Error(
                    "Errore nel recupero degli orari"
                );
            }
            return res.json();
        })
        .then(response => {
            let filmSelezionato = String(filmSelect.value);
            orariAltriFilm = [];
            orariFilmCorrente = [];
            durataPerOrario = {};

            response.programmazioni.forEach(p => {
                let orario = p.orario;
                let filmId = String(p.filmId);
                let durata = Number(p.durata) || 0;
                durataPerOrario[orario] = durata;

                if (filmId === filmSelezionato) {
                    orariFilmCorrente.push(orario);
                } else {
                    orariAltriFilm.push(orario);
                }
            });
            preparaOrariDisponibili();
        })
        .catch(error => {
            console.error(
                "Errore backend orari:",
                error
            );
            resetOrari();
        })
        .finally(() => {
            richiestaOrariInCorso = false;
        });
    }


    // =========================================================
    // PREPARAZIONE ORARI DISPONIBILI
    // =========================================================
    function preparaOrariDisponibili() {
        let checkboxes = document.querySelectorAll("#programmazione input[name='orari']");
        checkboxes.forEach(cb => {
            let label = cb.nextElementSibling;
            cb.checked = false;
            cb.disabled = false;

            // RESET GRAFICO
            label.style.color = "";
            label.style.textDecoration = "";
            label.style.opacity = "";
            label.title = "";

            // =====================================================
            // ALTRO FILM
            // =====================================================

            if (orariAltriFilm.includes(cb.value)) {
                cb.disabled = true;

                label.style.color = "#999";
                label.style.textDecoration = "line-through";
                label.style.opacity = "0.6";
                label.title = "Orario occupato da un altro film";
                return;
            }
        });

        aggiornaBlocchiDurata();

        checkboxes.forEach(cb => {
            cb.onchange = function () {
                aggiornaBlocchiDurata();
            };

        });
    }

    // =========================================================
    // CONTROLLO DURATA FILM
    // =========================================================

    function aggiornaBlocchiDurata() {
        let checkboxes =document.querySelectorAll("#programmazione input[name='orari']");

        // RESET STATO
        checkboxes.forEach(cb => {
            if (orariAltriFilm.includes(cb.value)) {
                cb.disabled = true;
            } else {
                cb.disabled = false;
            }
        });

        // ORARI SELEZIONATI

        let selezionati =[...checkboxes].filter(cb => cb.checked);

        // BLOCCO DURATA
        selezionati.forEach(cb => {
            bloccaIntervallo(
                cb.value,
                cb
            );
        });

        // CONTROLLO EVENTUALI CONFLITTI
        selezionati.forEach(cb => {
            if (cb.disabled) {
                cb.checked = false;
            }
        });

        // RICALCOLO
        [...checkboxes]
            .filter(cb => cb.checked)
            .forEach(cb => {
                bloccaIntervallo(
                    cb.value,
                    cb
                );
            });
    }


    // =========================================================
    // BLOCCA INTERVALLO DEL FILM
    // =========================================================

    function bloccaIntervallo(orarioSelezionato,checkboxSelezionato) {
        let durata = durataPerOrario[orarioSelezionato];

        if (!durata || durata <= 0) {
            return;
        }

        let startMin = convertiOraInMinuti(orarioSelezionato);
        let endMin =startMin + durata;
        let checkboxes = document.querySelectorAll("#programmazione input[name='orari']");

        checkboxes.forEach(cb => {
            if (cb === checkboxSelezionato) {
                return;
            }

            // =====================================================
            // ALTRO FILM
            // =====================================================
            if (orariAltriFilm.includes(cb.value)) {
                cb.disabled = true;
                return;
            }

            // =====================================================
            // CONTROLLO DURATA
            // =====================================================

            let currentMin = convertiOraInMinuti(cb.value);

            if (currentMin > startMin &&currentMin < endMin) {
                cb.disabled = true;
            }
        });
    }

//ID
document.addEventListener("click",function (e) {

        let button = e.target.closest(".btn-edit-programmazione");

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
    // AGGIUNGI MODIFICA
    // =========================================================
    async function modificaProgrammazione(id) {

        try {
            let response =await fetch(`/api/programmazione/${id}`);

            if (!response.ok) {
                throw new Error(
                    "Errore nel recupero della programmazione"
                );
            }

            let programmazione = await response.json();

            // =====================================================
            // ATTIVA MODALITÀ MODIFICA
            // =====================================================

            modalitaModifica = true;

            programmazioneIdModifica = programmazione.id;

            // =====================================================
            // SALVIAMO GLI ORARI ORIGINALI
            // =====================================================

            orariOriginaliModifica = [...programmazione.orari];

            // FILM
            filmSelect.value = programmazione.filmId;

            // DATA
            dataInput.value = programmazione.data;

            // SALA
            const radioSala =document.querySelector(`#programmazione input[name='sala'][value="${programmazione.sala}"]`);

            if (radioSala) {
                radioSala.checked = true;
            }

            // CARICHIAMO LA GRIGLIA DELLA SALA
            await aggiornaOrariBackend();

            // SELEZIONIAMO GLI ORARI DELLA PROGRAMMAZIONE

            document.querySelectorAll("#programmazione input[name='orari']").forEach(cb => {
                    cb.checked =
                        programmazione.orari.includes(
                            cb.value
                        );
                });

            aggiornaBlocchiDurata();

            // PORTIAMO L'UTENTE AL FORM
            document.getElementById("programmazione")?.scrollIntoView({behavior: "smooth"});
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
    // SUBMIT PROGRAMMAZIONE
    // =========================================================

    programmazioneForm.addEventListener(
        "submit",
        async function (e) {

            e.preventDefault();


            let film = filmSelect.value;
            let data = dataInput.value;
            let sala = document.querySelector("#programmazione input[name='sala']:checked")?.value;
            let orariSelezionati = [...document.querySelectorAll("#programmazione input[name='orari']:checked")] .map(cb => cb.value);

            // =====================================================
            // VALIDAZIONE
            // =====================================================

            if (!film || !data || !sala) {
                alert(
                    "Seleziona film, data e sala."
                );
                return;
            }

            if (orariSelezionati.length === 0) {
                alert("Seleziona almeno un orario." );

                return;
            }
            try {

                // =================================================
                // MODIFICA
                // =================================================

                if (modalitaModifica) {

                    const response =
                        await fetch(
                            `/api/programmazione/${programmazioneIdModifica}`,
                            {
                                method: "PUT",

                                headers: {
                                    "Content-Type":
                                        "application/json"
                                },

                                body: JSON.stringify({

                                    filmId: film,

                                    data: data,

                                    sala: sala,

                                    orari:
                                        orariSelezionati

                                })
                            }
                        );


                    if (!response.ok) {

                        throw new Error(
                            "Errore durante la modifica"
                        );
                    }


                    alert(
                        "Programmazione modificata correttamente."
                    );


                }

                // =================================================
                // CREAZIONE
                // =================================================

                else {

                    await Promise.all(

                        orariSelezionati.map(
                            orario => {

                                return fetch(
                                    "/api/programmazione/save",
                                    {
                                        method: "POST",

                                        headers: {
                                            "Content-Type":
                                                "application/json"
                                        },

                                        body: JSON.stringify({

                                            filmId: film,

                                            data: data,

                                            sala: sala,

                                            orario: orario

                                        })
                                    }
                                )
                                .then(res => {

                                    if (!res.ok) {

                                        throw new Error(
                                            "Errore durante il salvataggio"
                                        );
                                    }

                                    return res.json();
                                });
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

                programmazioneIdModifica = null;

                orariOriginaliModifica = [];


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
    programmazioneForm.addEventListener("reset",function () {
            /*
             * Il reset nativo del browser avviene
             * subito dopo l'evento.
             *
             * setTimeout permette di eseguire il nostro
             * reset completo dopo quello HTML.
             */

            setTimeout(() => {
                resetFormProgrammazione();
            }, 0);

        }
    );

});

document.addEventListener(
    "click",
    async function (e) {

        const button =
            e.target.closest(
                ".btn-delete-programmazione"
            );


        if (!button) {
            return;
        }


        const id =
            button.dataset.id;


        if (
            !confirm(
                "Sei sicuro di voler eliminare questa programmazione?"
            )
        ) {

            return;
        }


        try {

            const response =
                await fetch(
                    `/api/programmazione/${id}`,
                    {
                        method: "DELETE"
                    }
                );


            if (!response.ok) {

                throw new Error(
                    "Errore durante l'eliminazione"
                );
            }


            alert(
                "Programmazione eliminata correttamente."
            );


            caricaTabellaProgrammazioni();


        } catch (error) {

            console.error(
                "Errore eliminazione:",
                error
            );

            alert(
                "Impossibile eliminare la programmazione."
            );
        }

    }
);
