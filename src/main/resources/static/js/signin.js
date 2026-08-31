// =========================================================
// PANNELLO SLIDE LOGIN / REGISTRAZIONE
// =========================================================

let signUpButton = document.getElementById("signUp");
let signInButton = document.getElementById("signIn");
let container    = document.getElementById("container");

signUpButton.addEventListener("click", () => {
    container.classList.add("right-panel-active");
});

signInButton.addEventListener("click", () => {
    container.classList.remove("right-panel-active");
});


// =========================================================
// ERRORE LOGIN — Spring Security reindirizza a /login-error
// Se l'URL contiene "login-error" mostriamo il messaggio
// =========================================================

if (window.location.pathname.includes("login-error")) {
    container.classList.remove("right-panel-active");

    let usernameInput = document.getElementById("login-username");
    let passwordInput = document.getElementById("login-password");

    // Mostra errore sotto entrambi gli input
    if (usernameInput) {
        usernameInput.classList.add("input-error");
        let errU = usernameInput.closest(".login-field").querySelector(".field-error");
        if (errU) {
            errU.textContent = "Username o password errati.";
            errU.style.visibility = "visible";
        }
    }
    if (passwordInput) {
        passwordInput.classList.add("input-error");
        let errP = passwordInput.closest(".login-field").querySelector(".field-error");
        if (errP) {
            errP.textContent = "Username o password errati.";
            errP.style.visibility = "visible";
        }
    }
}


// =========================================================
// VALIDAZIONE REGISTRAZIONE
// =========================================================

const REGEX = {
    email:    /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    username: /^[a-zA-Z0-9_]{3,20}$/,
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/,
    nome:     /^[a-zA-ZÀ-ÿ\s']{2,50}$/,
    cognome:  /^[a-zA-ZÀ-ÿ\s']{2,50}$/
};

const MESSAGGI = {
    email:      "Inserisci un'email valida",
    username:   "3-20 caratteri: lettere, numeri e _",
    password:   "min 8 caratteri: 1 maiuscola, 1 numero, 1 simbolo",
    nome:       "almeno 2 caratteri, solo lettere",
    cognome:    "almeno 2 caratteri, solo lettere",
    dataNascita:"Inserisci la data di nascita"
};

// Mostra errore sotto un input
function showError(inputEl, messaggio) {
    // Cerca il reg-field padre (può essere diretto o dentro input-wrapper)
    let container = inputEl.closest(".reg-field") || inputEl.parentNode;

    let errorEl = container.querySelector(".field-error");
    if (!errorEl) {
        errorEl = document.createElement("span");
        errorEl.classList.add("field-error");
        container.appendChild(errorEl);
    }
    errorEl.textContent = messaggio;
    errorEl.style.visibility = "visible";
    inputEl.classList.add("input-error");
}

// Rimuove errore da un input
function clearError(inputEl) {
    let container = inputEl.closest(".reg-field") || inputEl.parentNode;
    let errorEl = container.querySelector(".field-error");
    if (errorEl) {
        errorEl.style.visibility = "hidden";
    }
    inputEl.classList.remove("input-error");
}

// Valida un singolo campo al blur
function validaCampo(input, regexKey) {
    const val = input.value.trim();

    if (regexKey === "dataNascita") {
        if (!val) {
            showError(input, MESSAGGI.dataNascita);
            return false;
        }
        // Deve essere maggiorenne
        const oggi = new Date();
        const nascita = new Date(val);
        let eta = oggi.getFullYear() - nascita.getFullYear();
        const m = oggi.getMonth() - nascita.getMonth();
        if (m < 0 || (m === 0 && oggi.getDate() < nascita.getDate())) eta--;
        if (eta < 16) {
            showError(input, "Devi avere almeno 16 anni per registrarti.");
            return false;
        }
        clearError(input);
        return true;
    }

    if (!REGEX[regexKey].test(val)) {
        showError(input, MESSAGGI[regexKey]);
        return false;
    }
    clearError(input);
    return true;
}


// =========================================================
// FORM REGISTRAZIONE
// =========================================================

document.addEventListener("DOMContentLoaded", function () {

    let formRegistrazione = document.getElementById("formRegistrazione");
    if (!formRegistrazione) return;

    // Campi
    let nomeInput        = document.getElementById("reg-nome");
    let cognomeInput     = document.getElementById("reg-cognome");
    let dataNascitaInput = document.getElementById("reg-dataNascita");
    let emailInput       = document.getElementById("reg-email");
    let usernameInput    = document.getElementById("reg-username");
    let passwordInput    = document.getElementById("reg-password");
    let submitError      = document.getElementById("reg-submit-error");

    // Validazione live al blur
    nomeInput.addEventListener       ("blur", () => validaCampo(nomeInput,        "nome"));
    cognomeInput.addEventListener    ("blur", () => validaCampo(cognomeInput,      "cognome"));
    dataNascitaInput.addEventListener("blur", () => validaCampo(dataNascitaInput,  "dataNascita"));
    emailInput.addEventListener      ("blur", () => validaCampo(emailInput,        "email"));
    usernameInput.addEventListener   ("blur", () => validaCampo(usernameInput,     "username"));
    passwordInput.addEventListener   ("blur", () => validaCampo(passwordInput,     "password"));

    // =========================================================
    // TOGGLE VISIBILITÀ PASSWORD
    // =========================================================
    document.querySelectorAll(".toggle-password").forEach(btn => {
        btn.addEventListener("click", function () {
            let targetId = this.dataset.target;
            let input = document.getElementById(targetId);
            let img = this.querySelector("img");

            if (!input || !img) return;

            if (input.type === "password") {
                input.type  = "text";
                img.src = "/img/password_rivelata.svg";
                img.alt = "nascondi password";
            } else {
                // Nascondi password
                input.type = "password";
                img.src = "/img/password_oscurata.svg";
                img.alt = "mostra password";
            }
        });
    });

    // Submit
    formRegistrazione.addEventListener("submit", async function (e) {
        e.preventDefault();

        // Valida tutti i campi
        let valido =
            validaCampo(nomeInput,        "nome")        &
            validaCampo(cognomeInput,     "cognome")     &
            validaCampo(dataNascitaInput, "dataNascita") &
            validaCampo(emailInput,       "email")       &
            validaCampo(usernameInput,    "username")    &
            validaCampo(passwordInput,    "password");

        if (!valido) return;

        const dto = {
            nome:         nomeInput.value.trim(),
            cognome:      cognomeInput.value.trim(),
            dataNascita:  dataNascitaInput.value,
            email:        emailInput.value.trim(),
            username:     usernameInput.value.trim(),
            password:     passwordInput.value
        };

        try {
            const response = await fetch("/login/registrati", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dto)
            });

            if (response.ok) {
                // Registrazione OK → vai al login
                container.classList.remove("right-panel-active");
                let successDiv = document.getElementById("loginSuccess");
                if (successDiv) {
                    successDiv.textContent = "Registrazione completata! Ora accedi.";
                    successDiv.style.display = "block";
                }
            } else {
                let errore = await response.text();
                // Es. "Username già esistente"
                if (submitError) {
                    submitError.textContent = errore;
                    submitError.style.display = "block";
                }
            }

        } catch (error) {
            console.error("Errore registrazione:", error);
            if (submitError) {
                submitError.textContent = "Errore di rete. Riprova.";
                submitError.style.display = "block";
            }
        }
    });
});