// =========================================================
// DATATABLES - CONFIGURAZIONE GENERALE
// =========================================================

let dataTableDefaults = {

    dom:
        "<'row mb-3'<'col-md-6'f><'col-md-6 text-end'l>>" +
        "<'row'<'col-12'tr>>" +
        "<'row mt-3'<'col-md-5'i><'col-md-7'p>>",

    language: {

        emptyTable: "Nessun dato disponibile nella tabella",

        info: "Visualizzazione da _START_ a _END_ di _TOTAL_ elementi",

        infoEmpty: "Nessun elemento disponibile",

        lengthMenu: "Mostra _MENU_ elementi",

        search: "Cerca:",

        zeroRecords: "Nessun risultato trovato",

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

    let [anno, mese, giorno] = dataISO.split("-");

    return `${giorno}/${mese}/${anno}`;
}


// =========================================================
// FUNZIONE GENERICA DATATABLE
// =========================================================

function inizializzaDataTable(selector, options = {}) {

    let elemento = document.querySelector(selector);

    if (!elemento) {
        return null;
    }

    if ($.fn.DataTable.isDataTable(elemento)) {
        $(elemento).DataTable().destroy();
    }

    return $(elemento).DataTable({

        ...dataTableDefaults,

        ...options
    });
}


// =========================================================
// TABELLA PROGRAMMAZIONI
// =========================================================

function inizializzaTabellaProgrammazioni() {

    return inizializzaDataTable(
        "#tableScheduling",
        {

            // ---------------------------------------------
            // ORDINAMENTO INIZIALE
            // Data crescente
            // ---------------------------------------------

            order: [[2, "asc"]],


            // ---------------------------------------------
            // COLONNE
            // ---------------------------------------------

            columns: [

                // 0 - TITOLO
                {
                    orderable: true,
                    searchable: true
                },


                // 1 - SALA
                {
                    orderable: true,
                    searchable: true
                },


                // 2 - DATA
                {
                    orderable: true,
                    searchable: true,

                    render: function (data, type) {

                        if (!data) {
                            return "";
                        }

                        // Per ordinamento DataTables utilizza
                        // il formato ISO originale.
                        if (
                            type === "sort" ||
                            type === "type"
                        ) {
                            return data;
                        }

                        // Per la visualizzazione mostriamo
                        // GG/MM/AAAA.
                        if (type === "display") {
                            return formattaData(data);
                        }

                        return data;
                    }
                },


                // 3 - AZIONI
                {
                    orderable: false,
                    searchable: false
                }
            ]
        }
    );
}


// =========================================================
// CARICAMENTO PROGRAMMAZIONI
// =========================================================

async function caricaTabellaProgrammazioni() {

    let table = inizializzaTabellaProgrammazioni();

    if (!table) {
        return;
    }

    try {

        const response = await fetch("/gestioneProgrammazione/listaProgrammazioni");

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const listaProgrammazioni = await response.json();


        // ---------------------------------------------
        // SVUOTA TABELLA
        // ---------------------------------------------

        table.clear();


        // ---------------------------------------------
        // INSERIMENTO RIGHE
        // ---------------------------------------------

        listaProgrammazioni.forEach(programmazione => {

            let azioni = `
                <div class="btn-group d-flex justify-content-center">

                    <button
                        type="button"
                        class="btn btn-outline-success btn-edit-programmazione"
                        data-film="${programmazione.idFilm}"
                        data-sala="${programmazione.idSala}"
                        data-data="${programmazione.data}"
                        title="Modifica programmazione">

                        <i class="fa-solid fa-pen-to-square"></i>

                    </button>

                    <button
                        type="button"
                        class="btn btn-outline-danger btn-delete-programmazione"
                        data-film="${programmazione.idFilm}"
                        data-sala="${programmazione.idSala}"
                        data-data="${programmazione.data}"
                        title="Elimina programmazione">

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
        });


        // ---------------------------------------------
        // DISEGNA TABELLA
        // ---------------------------------------------

        table.draw();

    } catch (error) {

        // Gestione silenziosa dell'errore.
        // In futuro qui potrai eventualmente mostrare
        // un messaggio all'utente.
    }
}


// =========================================================
// TABELLA FILM
// =========================================================

function inizializzaTabellaFilm() {

    return inizializzaDataTable(
        "#tableFilm",
        {
            columnDefs: [
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
// TABELLA SALE
// =========================================================

function inizializzaTabellaSale() {

    return inizializzaDataTable(
        "#tableSale",
        {
            columnDefs: [
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
// TABELLA UTENTI
// =========================================================

function inizializzaTabellaUtenti() {

    return inizializzaDataTable(
        "#tableUtenti",
        {
            columnDefs: [
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
// TABELLA PRENOTAZIONI
// =========================================================

function inizializzaTabellaPrenotazioni() {

    return inizializzaDataTable(
        "#tablePrenotazioni",
        {
            columnDefs: [
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
// DOM READY
// =========================================================

document.addEventListener("DOMContentLoaded", function () {

    // Programmazioni
    if (document.querySelector("#tableScheduling")) {
        caricaTabellaProgrammazioni();
    }

    // Film
    if (document.querySelector("#tableFilm")) {
        inizializzaTabellaFilm();
    }

    // Sale
    if (document.querySelector("#tableSale")) {
        inizializzaTabellaSale();
    }


    // Utenti
    if (document.querySelector("#tableUtenti")) {
        inizializzaTabellaUtenti();
    }

    // Prenotazioni
    if (document.querySelector("#tablePrenotazioni")) {
        inizializzaTabellaPrenotazioni();
    }

});