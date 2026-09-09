document.addEventListener("DOMContentLoaded", () => {

    // =====================================================
    // NAVIGAZIONE SIDEBAR
    // =====================================================

    const buttons = document.querySelectorAll(".menu-btn");
    const sections = document.querySelectorAll(".content-section");

    function showSection(target) {

        sections.forEach(section => {
            section.style.display = "none";
        });

        const activeSection = document.getElementById(target);

        if (activeSection) {
            activeSection.style.display = "block";
        }

        buttons.forEach(button => {
            button.classList.remove("active");
        });

        const activeButton = document.querySelector(
            `[data-target="${target}"]`
        );

        if (activeButton) {
            activeButton.classList.add("active");
        }
    }

    buttons.forEach(button => {
        button.addEventListener("click", () => {
            showSection(button.dataset.target);
        });
    });


    // =====================================================
    // PULSANTI MODIFICA
    // =====================================================

    document.querySelectorAll(".edit-btn").forEach(button => {

        button.addEventListener("click", () => {
            showSection("profile");
        });

    });


    // =====================================================
    // FUNZIONI ERRORI
    // =====================================================

    function mostraErrore(input, messaggio) {
        input.classList.add("input-error");

        let error = input.parentElement.querySelector(".field-error");

        if (!error) {
            error = document.createElement("span");
            error.classList.add("field-error");
            input.parentElement.appendChild(error);
        }
        error.textContent = messaggio;
        error.classList.add("visible");
    }


    function rimuoviErrore(input) {
        input.classList.remove("input-error");

        let error = input.parentElement.querySelector(".field-error");

        if (error) {
            error.textContent = "";
            error.classList.remove("visible");
        }
    }


    // =====================================================
    // FUNZIONE STATO PULSANTE SALVA
    // =====================================================

    function setState(button, active) {

        if (!button) return;

        button.classList.toggle("active", active);
        button.disabled = !active;
    }

    // =====================================================
    // VALIDAZIONE FORM
    // =====================================================

    // VALIDAZIONE NOME E COGNOME

    function soloLettere(input) {
        input.addEventListener("input", () => {
            input.value = input.value.replace( /[^a-zA-ZÀ-ÖØ-öø-ÿ\s]/g, "");
            if (input.value.trim() !== "") {
                rimuoviErrore(input);
            }
        });
    }

    let nome = document.getElementById("nome");
    let cognome = document.getElementById("cognome");

    if (nome) {
        soloLettere(nome);
    }
    if (cognome) {
        soloLettere(cognome);
    }


    // VALIDAZIONE EMAIL
    let email = document.getElementById("email");

    if (email) {
        email.addEventListener("input", () => {
            if (email.value.trim() === "") {
                rimuoviErrore(email);
                return;
            }

            let emailValida = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value);

            if (emailValida) {
                rimuoviErrore(email);
            }
        });

        email.addEventListener("blur", () => {
            if (email.value.trim() === "") {
                rimuoviErrore(email);
                return;
            }

            const emailValida =  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value);

            if (!emailValida) {
                mostraErrore(email, "Formato email non valido");
            }
        });
    }


    // COMPLEANNO
    let birthdayWrapper = document.querySelector(".birthday-wrapper");

    if (birthdayWrapper) {
        let birthdayInputs =  birthdayWrapper.querySelectorAll("input");

        let giorno = birthdayInputs[0];
        let mese = birthdayInputs[1];
        let anno = birthdayInputs[2];

        // Solo numeri
        [giorno, mese, anno].forEach(input => {
            input.addEventListener("input", () => {
                input.value = input.value.replace(/\D/g, "");
                rimuoviErrore(input);
            });
        });


        // GIORNO
        giorno.addEventListener("blur", () => {
            if (giorno.value === "") {
                rimuoviErrore(giorno);
                return;
            }

            let valore = Number(giorno.value);

            if (valore < 1 || valore > 31) {
                mostraErrore(
                    giorno,
                    "Il giorno deve essere compreso tra 1 e 31"
                );
            }
        });


        // MESE
        mese.addEventListener("blur", () => {
            if (mese.value === "") {
                rimuoviErrore(mese);
                return;
            }

            let valore = Number(mese.value);

            if (valore < 1 || valore > 12) {
                mostraErrore( mese,"Il mese deve essere compreso tra 1 e 12");
            }
        });


        // ANNO
        anno.addEventListener("blur", () => {
            if (anno.value === "") {
                rimuoviErrore(anno);
                return;
            }
            if (anno.value.length !== 4) {
                mostraErrore(anno, "Inserisci un anno valido");
            }
        });
    }


    // PASSWORD
    let passwordForm = document.getElementById("password");

    if (passwordForm) {
        let passwordInput = passwordForm.querySelector('input[type="password"]:not(#confirmPassword)');
        let confirmPassword = document.getElementById("confirmPassword");
        let passwordSaveButton = passwordForm.querySelector(".save-btn");

        // VALIDAZIONE PASSWORD
        function passwordValida(value) {
            return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/
                .test(value);
        }

        passwordInput.addEventListener("input", () => {
            if (passwordInput.value === "") {
                rimuoviErrore(passwordInput);
                return;
            }
            if (passwordValida(passwordInput.value)) {
                rimuoviErrore(passwordInput);
            }
        });


        passwordInput.addEventListener("blur", () => {
            if (passwordInput.value === "") {
                rimuoviErrore(passwordInput);
                return;
            }
            if (!passwordValida(passwordInput.value)) {
                mostraErrore( passwordInput, "La password non rispetta i requisiti");
            }
        });


        // CONFERMA PASSWORD
        confirmPassword.addEventListener("input", () => {
            if (confirmPassword.value === "") {
                rimuoviErrore(confirmPassword);
                return;
            }
            if (
                confirmPassword.value ===
                passwordInput.value
            ) {
                rimuoviErrore(confirmPassword);
            }
        });


        confirmPassword.addEventListener("blur", () => {

            if (confirmPassword.value === "") {
                rimuoviErrore(confirmPassword);
                return;
            }
            if (
                confirmPassword.value !==
                passwordInput.value
            ) {
                mostraErrore( confirmPassword, "password errata");
            }
        });


        // SALVA PASSWORD
        passwordSaveButton.addEventListener("click", (event) => {
            let valido = true;

            if (
                passwordInput.value !== "" &&
                !passwordValida(passwordInput.value)
            ) {
                mostraErrore( passwordInput,"La password non rispetta i requisiti");
                valido = false;
            }
            if (
                confirmPassword.value !== "" &&
                confirmPassword.value !== passwordInput.value
            ) {
                mostraErrore( confirmPassword,"password errata");
                valido = false;
            }
            if (!valido) {
                event.preventDefault();
                return;
            }
            setState(passwordSaveButton, false);
        });
    }


    // =====================================================
    // DETTAGLI DI CONTATTO
    // =====================================================

    let telefono = document.getElementById("telefono");
    let indirizzo = document.getElementById("indirizzo");
    let citta = document.getElementById("citta");
    let cap = document.getElementById("cap");


    // CELLULARE
    if (telefono) {
        telefono.addEventListener("input", () => {
            telefono.value = telefono.value.replace(/\D/g, "");
            rimuoviErrore(telefono);
        });
    }


    // INDIRIZZO
    if (indirizzo) {
        indirizzo.addEventListener("input", () => {
            indirizzo.value = indirizzo.value.replace( /[^a-zA-ZÀ-ÖØ-öø-ÿ0-9\s]/g,"" );
            rimuoviErrore(indirizzo);
        });
    }



    // CITTÀ
    if (citta) {
        citta.addEventListener("input", () => {
            citta.value = citta.value.replace( /[^a-zA-ZÀ-ÖØ-öø-ÿ\s]/g,"");
            rimuoviErrore(citta);
        });
    }


    // CAP
    if (cap) {
        cap.addEventListener("input", () => {
            cap.value = cap.value.replace(/\D/g, "");
            rimuoviErrore(cap);
        });
    }


    // =====================================================
    // GESTIONE FORM
    // =====================================================

    function initFormSave(formId) {
        let form = document.getElementById(formId);

        if (!form) return;

        let inputs = form.querySelectorAll(".form-control");
        let saveButton = form.querySelector(".save-btn");

        if (!saveButton) return;
        setState(saveButton, false);

        inputs.forEach(input => {
            input.addEventListener("input", () => {
                setState(saveButton, true);
            });

        });

        saveButton.addEventListener("click", () => {
            setState(saveButton, false);
        });
    }

    initFormSave("sunto");
    initFormSave("password");
    initFormSave("details");


    // =====================================================
    // CODICE QR BIGLIETTI E MENU
    // =====================================================

//    FORMATTAZIONE DATA PER QR
    function formattaData(data) {
        let [anno, mese, giorno] = data.split("-");
        return `${giorno}${mese}${anno.substring(2)}`;
    }

//    CREAZIONE DEL CODICE QR
    function generaQR(element, codice, size) {
        element.innerHTML = "";

        new QRCode(element, {
            text: codice,
            width: size,
            height: size
        });
    }

    function generaCodiceBiglietto(biglietto) {
        let data = formattaData(biglietto.giorno);
        return `FILM${biglietto.id}${data}${biglietto.sala}${biglietto.colonna}${biglietto.fila}`;
    }

    function generaCodiceMenu(offerta) {
        let data = formattaData(offerta.dataAcquisto);
        return `MEN${offerta.idOfferta}${offerta.quantita}${data}`;
    }


    // =====================================================
    // BIGLIETTI
    // =====================================================
    caricaBiglietti();


    async function caricaBiglietti() {
        let container = document.getElementById("tickets-container");

        if (!container) return;
        try {
            const response = await fetch("/utente/acquisti");
            if (!response.ok) {
                throw new Error( "Errore nel caricamento dei biglietti");
            }
            const biglietti = await response.json();

            container.innerHTML = "";

            if (biglietti.length === 0) {
                container.innerHTML = `
                    <div class="col-12 text-center">
                        <h3>Nessun biglietto acquistato</h3>
                    </div>
                `;
                return;
            }

            biglietti.forEach(biglietto => {
                container.appendChild(
                    creaCardBiglietto(biglietto)
                );

            });

        } catch (error) {
            console.error(error);

            container.innerHTML = `
                <div class="col-12 text-center">
                    <p>Errore nel caricamento dei biglietti.</p>
                </div>
            `;
        }
    }

//    CREA CARD BIGLIETTO
    function creaCardBiglietto(biglietto) {
        let col = document.createElement("div");
        col.className = "col-md-6 col-lg-4";
        let codice = generaCodiceBiglietto(biglietto);

        col.innerHTML = `
            <div class="ticket-card">
                <h4>${biglietto.titolo}</h4>
                <p>
                    Data: ${biglietto.giorno}
                </p>
                <p>
                    Orario: ${biglietto.inizio}
                </p>
                <p>
                    Sala: ${biglietto.sala}
                </p>
                <p>
                    Fila: ${biglietto.fila}
                </p>
                <p>
                    Posto: ${biglietto.colonna}
                </p>
                <p>
                    Prezzo: € ${biglietto.prezzo}
                </p>

                <div class="qrcode"></div>
                <p class="codice">${codice}</p>
            </div>
        `;

        let qrElement = col.querySelector(".qrcode");
        generaQR(qrElement, codice, 120);
        return col;
    }


    // =====================================================
    // MENÙ
    // =====================================================

    caricaMenu();

    async function caricaMenu() {
        let container = document.getElementById("menus-container");
        if (!container) return;
        try {
            const response = await fetch("/utente/acquistiOfferte");
            if (!response.ok) {
                throw new Error(
                    "Errore nel caricamento dei menù"
                );
            }
            const acquisti = await response.json();

            container.innerHTML = "";

            if (acquisti.length === 0) {
                container.innerHTML = `
                    <div class="col-12 text-center">
                        <h3>Nessun menù acquistato</h3>
                    </div>
                `;
                return;
            }

            let offerteRaggruppate = {};

            acquisti.forEach(offerta => {

                let idOfferta = offerta.idOfferta;
                if (!offerteRaggruppate[idOfferta]) {
                    offerteRaggruppate[idOfferta] = {
                        ...offerta,
                        quantita: 1
                    };
                } else {
                    offerteRaggruppate[idOfferta]
                        .quantita++;
                }
            });

            Object.values(offerteRaggruppate)
                .forEach(offerta => {
                    container.appendChild(
                        creaCardMenu(offerta)
                    );
                });

        } catch (error) {
            console.error(error);
            container.innerHTML = `
                <div class="col-12 text-center">
                    <p>Errore nel caricamento dei menù.</p>
                </div>
            `;
        }
    }

//    CREA CARD MENU
    function creaCardMenu(offerta) {
        let col = document.createElement("div");
        col.className = "col-md-6 col-lg-4";
        let codice = generaCodiceMenu(offerta);

        col.innerHTML = `
            <div class="menu-card">
                <img
                    src="${offerta.imgBanner}"
                    alt="${offerta.nome}"
                >
                <h4>${offerta.nome}</h4>
                <p>
                    Quantità: ${offerta.quantita}
                </p>
                <div class="menu-qrcode"></div>
                <p class="menu-code">${codice}</p>
            </div>
        `;

        let qrElement = col.querySelector(".menu-qrcode");
        generaQR(qrElement, codice, 160);
        return col;
    }

});