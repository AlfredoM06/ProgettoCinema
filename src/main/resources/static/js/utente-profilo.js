const buttons = document.querySelectorAll(".menu-btn");
const sections = document.querySelectorAll(".content-section");

// =========================
// NAVIGAZIONE
// =========================
function showSection(target) {
    sections.forEach(sec => sec.style.display = "none");

    const active = document.getElementById(target);
    if (active) active.style.display = "block";

    buttons.forEach(b => b.classList.remove("active"));
    const btn = document.querySelector(`[data-target="${target}"]`);
    if (btn) btn.classList.add("active");
}

buttons.forEach(btn => {
    btn.addEventListener("click", () => {
        showSection(btn.getAttribute("data-target"));
    });
});

document.querySelectorAll(".edit-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        showSection("profile");
    });
});


// =========================
// SAVE LOGIC PER FORM (FIX PRINCIPALE)
// =========================

function initFormSave(formId) {
    const form = document.getElementById(formId);
    if (!form) return;

    const inputs = form.querySelectorAll(".form-control");
    const saveBtn = form.querySelector(".save-btn");

    if (!saveBtn) return;

    setState(saveBtn, false);

    inputs.forEach(input => {
        input.addEventListener("input", () => {
            setState(saveBtn, true);
        });
    });

    saveBtn.addEventListener("click", () => {
        setState(saveBtn, false);
    });
}

function setState(btn, active) {
    if (!btn) return;

    if (active) {
        btn.classList.add("active");
        btn.disabled = false;
    } else {
        btn.classList.remove("active");
        btn.disabled = true;
    }
}


// =========================
// INIT (USA I TUOI ID REALI)
// =========================
initFormSave("sunto");
initFormSave("password");
initFormSave("details");


// =========================
// QR CODE (uguale)
// =========================
function generaCodiceMock(id) {
    return `CIN-${id}-${Math.floor(1000 + Math.random() * 9000)}`;
}

document.querySelectorAll(".qrcode").forEach(el => {
    const id = el.getAttribute("data-id");
    const codice = generaCodiceMock(id);

    new QRCode(el, {
        text: codice,
        width: 120,
        height: 120
    });

    const codiceText = el.parentElement.querySelector(".codice");
    if (codiceText) {
        codiceText.innerText = codice;
    }
});