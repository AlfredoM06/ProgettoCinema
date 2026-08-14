    // =========================================================
    // |                                                       |
    // |        DATATABLES - CONFIGURAZIONE GENERALE           |
    // |                                                       |
    // =========================================================

const dataTableDefaults = {
    autoWidth: false,
    dom:
        "<'row mb-3'<'col-md-6'f><'col-md-6 text-end'l>>" +
        "<'row'<'col-12'tr>>" +
        "<'row mt-3'<'col-md-5'i><'col-md-7'p>>",

    language: {
        emptyTable:
            "Nessun dato disponibile nella tabella",
        info:
            "Visualizzazione da _START_ a _END_ di _TOTAL_ elementi",
        infoEmpty:
            "Nessun elemento disponibile",
        lengthMenu:
            "Mostra _MENU_ elementi",
        search:
            "Cerca:",
        zeroRecords:
            "Nessun risultato trovato",
        paginate: {
            first: "Prima",
            last: "Ultima",
            next: "Successiva",
            previous: "Precedente"
        }
    }
};


// =========================================================
// FORMATTAZIONE DATA
// =========================================================

function formattaData(dataISO) {
    if (!dataISO) {
        return "";
    }
    let [anno, mese, giorno] =dataISO.split("-");
    return `${giorno}/${mese}/${anno}`;
}


// =========================================================
// INIZIALIZZAZIONE GENERICA DATATABLE
// =========================================================

function inizializzaDataTable(selector, options = {}) {

    let elemento = document.querySelector(selector);

    if (!elemento) {
        return null;
    }

    /*
     * Se la tabella è già stata inizializzata,
     * viene distrutta prima di ricrearla.
     */
    if ($.fn.DataTable.isDataTable(elemento)) {
        $(elemento).DataTable().destroy();
    }

    return $(elemento).DataTable({
        ...dataTableDefaults,
        ...options
    });
}


    // =========================================================
    // |                                                       |
    // |              TABELLE FILM                             |
    // |                                                       |
    // =========================================================

function inizializzaTabellaFilm(selector) {

    return inizializzaDataTable(
        selector,
        {
            columnDefs: [

                // Nasconde la colonna contenente l'ID
                {
                    targets: 0,
                    visible: false
                },
                // La colonna delle azioni non viene ordinata
                // e non viene considerata nella ricerca
                {
                    targets: -1,
                    orderable: false,
                    searchable: false
                }
            ]
        }
    );
}

// =========================================================
// TABELLA FILM IN SALA
// =========================================================
function inizializzaTabellaFilmInSala() {
    return inizializzaTabellaFilm("#tableFilmInSala");
}


// =========================================================
// TABELLA FILM IN ARCHIVIO
// =========================================================

function inizializzaTabellaFilmArchivio() {
    return inizializzaTabellaFilm("#tableFilmArchivio");
}

// =========================================================
// CARICAMENTO TABELLA FILM
// =========================================================
async function caricaTabellaFilm( archiviato,inizializza) {

    const table = inizializza();

    if (!table) {
        return;
    }
    try {
        const response = await fetch(
            `/admin/gestioneFilm/listaArchivio/${archiviato}`
        );
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}` );
        }
        const films = await response.json();

        table.clear();
        films.forEach(film => {

            // Bottoni delle azioni disponibili per il film
            const azioni = `
                <div
                    class="btn-group d-flex justify-content-center"
                    role="group"
                >
                    <!-- Modifica film -->
                    <button
                        type="button"
                        class="btn btn-outline-success btn-edit-film"
                        data-id="${film.id}"
                        title="Modifica film"
                    >
                        <i class="fa-solid fa-pen-to-square"></i>
                    </button>

                    <!-- Archivia / ripristina film -->
                    <button
                        type="button"
                        class="btn btn-outline-warning btn-archive-film"
                        data-id="${film.id}"
                        title="${
                            archiviato
                                ? "Ripristina film"
                                : "Archivia film"
                        }"
                    >
                        <i class="fa-regular fa-folder-open"></i>
                    </button>

                    <!-- Elimina film -->
                    <button
                        type="button"
                        class="btn btn-outline-danger btn-delete-film"
                        data-id="${film.id}"
                        title="Elimina film"
                    >
                        <i class="fa-regular fa-trash-can"></i>
                    </button>

                </div>
            `;

            table.row.add([
                // ID nascosto
                film.id,
                // Dati visualizzati
                film.titolo,
                film.distribuzione,
                film.dataUscita,
                // Azioni
                azioni
            ]);
        });

        table.draw();
        table.columns.adjust();
    } catch (error) {
        // Errore gestito senza interrompere
        // il funzionamento della pagina.
    }
}


// =========================================================
// RICARICA TABELLE FILM
// =========================================================

function ricaricaTabelleFilm() {
    // Ricarica la tabella dei film in sala
        if (document.querySelector("#tableFilmInSala")) {
            caricaTabellaFilm(false,inizializzaTabellaFilmInSala);
        }

        // Ricarica la tabella dei film archiviati
        if (document.querySelector("#tableFilmArchivio")) {
            caricaTabellaFilm(true,inizializzaTabellaFilmArchivio);
        }
    }


// =========================================================
// TABELLA PROGRAMMAZIONI
// =========================================================

function inizializzaTabellaProgrammazioni() {

    return inizializzaDataTable("#tableScheduling",{
            // Ordina inizialmente per data
            order: [
                [2, "asc"]
            ],

            /*
             * Definisce il comportamento delle quattro colonne:
             *
             * 0 = Film
             * 1 = Sala
             * 2 = Data
             * 3 = Azioni
             */
            columns: [

                // Film
                {
                    orderable: true,
                    searchable: true
                },

                // Sala
                {
                    orderable: true,
                    searchable: true
                },

                // Data
                {
                    orderable: true,
                    searchable: true,

                    render: function (
                        data,
                        type
                    ) {

                        if (!data) {
                            return "";
                        }

                        /*
                         * Per ordinamento e tipo interno
                         * manteniamo la data originale ISO.
                         */
                        if (
                            type === "sort" ||
                            type === "type"
                        ) {
                            return data;
                        }

                        /*
                         * Per la visualizzazione all'utente
                         * convertiamo YYYY-MM-DD in DD/MM/YYYY.
                         */
                        if (type === "display") {
                            return formattaData(data);
                        }

                        return data;
                    }
                },

                // Azioni
                {
                    orderable: false,
                    searchable: false
                }
            ]
        }
    );
}


// =========================================================
// CARICAMENTO TABELLA PROGRAMMAZIONI
// =========================================================

async function caricaTabellaProgrammazioni() {

    let table = inizializzaTabellaProgrammazioni();

    if (!table) {
        return;
    }

    try {
        const response = await fetch("/gestioneProgrammazione/listaProgrammazioni");
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}` );
        }

        const listaProgrammazioni = await response.json();

        table.clear();

        listaProgrammazioni.forEach(
            programmazione => {

                // Bottoni delle azioni
                const azioni = `
                    <div
                        class="btn-group d-flex justify-content-center"
                    >

                        <!-- Modifica programmazione -->
                        <button
                            type="button"
                            class="btn btn-outline-success btn-edit-programmazione"
                            data-film="${programmazione.idFilm}"
                            data-sala="${programmazione.idSala}"
                            data-data="${programmazione.data}"
                            title="Modifica programmazione"
                        >
                            <i class="fa-solid fa-pen-to-square"></i>
                        </button>


                        <!-- Elimina programmazione -->
                        <button
                            type="button"
                            class="btn btn-outline-danger btn-delete-programmazione"
                            data-film="${programmazione.idFilm}"
                            data-sala="${programmazione.idSala}"
                            data-data="${programmazione.data}"
                            title="Elimina programmazione"
                        >
                            <i class="fa-regular fa-trash-can"></i>
                        </button>

                    </div>
                `;

                table.row.add([
                    programmazione.titolo,
                    programmazione.nomeSala,
                    programmazione.data,
                    azioni

                ]);
            }
        );

        table.draw();
        table.columns.adjust();

    } catch (error) {
        // Errore gestito senza interrompere
        // il funzionamento della pagina.
    }
}


// =========================================================
// TABELLA SALE
// =========================================================

// La configurazione verrà aggiunta quando
// verrà implementata la gestione delle sale.


// =========================================================
// TABELLA UTENTI
// =========================================================

// La configurazione verrà aggiunta quando
// verrà implementata la gestione degli utenti.


// =========================================================
// TABELLA PRENOTAZIONI
// =========================================================

// La configurazione verrà aggiunta quando
// verrà implementata la gestione delle prenotazioni.


    // =========================================================
    // |                                                       |
    // |                    DOM READY                          |
    // |                                                       |
    // =========================================================

document.addEventListener("DOMContentLoaded",function () {

        // =========================================================
        // RICALCOLA LARGHEZZE DATATABLE AL CAMBIO TAB
        // =========================================================

        document.querySelectorAll('#filmTab button[data-bs-toggle="tab"]').forEach(tabBtn => {
            tabBtn.addEventListener('shown.bs.tab', function (e) {
                const targetPane = document.querySelector(e.target.dataset.bsTarget);
                const table = targetPane?.querySelector('table.dataTable-init');

                if (table && $.fn.DataTable.isDataTable(table)) {
                    $(table).DataTable().columns.adjust().draw(false);
                }
            });
        });
        // TABELLA FILM IN SALA

        if (document.querySelector("#tableFilmInSala")) {
            caricaTabellaFilm(
                false,
                inizializzaTabellaFilmInSala
            );
        }
        // TABELLA FILM IN ARCHIVIO
        if (document.querySelector("#tableFilmArchivio")) {
            caricaTabellaFilm(
                true,
                inizializzaTabellaFilmArchivio
            );
        }


        // TABELLA PROGRAMMAZIONE
        if ( document.querySelector("#tableScheduling")) {
            caricaTabellaProgrammazioni();
        }

        // TABELLA SALE
//        if (document.querySelector("#tableSale")) {
//            inizializzaTabellaSale();
//        }

        // TABELLA UTENTI
//        if ( document.querySelector("#tableUtenti")) {
//            inizializzaTabellaUtenti();
//        }

    }
);