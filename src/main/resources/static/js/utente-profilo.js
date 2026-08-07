document.addEventListener("DOMContentLoaded", () => {

    let buttons = document.querySelectorAll(".menu-btn");
    let sections = document.querySelectorAll(".content-section");

    // =========================
    // NAVIGAZIONE
    // =========================

    function showSection(target) {
        sections.forEach(sec => {
            sec.style.display = "none";
        });

        let active = document.getElementById(target);

        if (active) {
            active.style.display = "block";
        }

        buttons.forEach(b => {
            b.classList.remove("active");
        });

        let btn = document.querySelector(`[data-target="${target}"]`);

        if (btn) {
            btn.classList.add("active");
        }

    }

    buttons.forEach(btn => {
        btn.addEventListener("click", () => {
            showSection(
                btn.dataset.target
            );
        });
    });


    document.querySelectorAll(".edit-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            showSection("profile");
        });
    });


    // =========================
    // FORM SAVE LOGIC
    // =========================


    function setState(btn, active) {
        if (!btn) return;

        btn.classList.toggle(
            "active",
            active
        );

        btn.disabled = !active;
    }



    function initFormSave(formId) {

        let form = document.getElementById(formId);

        if (!form) return;

        let inputs = form.querySelectorAll(".form-control");
        let saveBtn = form.querySelector(".save-btn");

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

    initFormSave("sunto");
    initFormSave("password");
    initFormSave("details");


    // =========================
    // QR GENERATOR
    // =========================


    function generaCodiceMock(prefix, id) {
        return `${prefix}-${id}-${Math.floor(1000 + Math.random() * 9000)}`;
    }

    function generaQR(element, codice, size) {
        new QRCode(element, {
            text: codice,
            width: size,
            height: size
        });
    }

    // =========================
    // QR TICKET
    // =========================

    document.querySelectorAll(".qrcode").forEach(el => {
        let id = el.dataset.id;
        let codice = generaCodiceMock(
            "CIN",
            id
        );

        generaQR(
            el,
            codice,
            120
        );

        let codiceText = el.parentElement.querySelector(".codice");

        if (codiceText) {
            codiceText.textContent = codice;
        }
    });


    // =========================
    // QR MENU
    // =========================


    document.querySelectorAll(".menu-qrcode").forEach(el => {
        let id = el.dataset.id;
        let codice = generaCodiceMock(
            "MEN",
            id
        );

        generaQR(
            el,
            codice,
            160
        );

        let codiceText = el.parentElement.querySelector(".menu-code");

        if (codiceText) {
            codiceText.textContent = codice;
        }
    });
});