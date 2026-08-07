document.addEventListener("DOMContentLoaded", function () {

    let buttons = document.querySelectorAll(".menu-btn");
    let sections = document.querySelectorAll(".content-section");


    function clearSidebarActive() {
        document.querySelectorAll(".menu-btn")
            .forEach(btn => btn.classList.remove("active"));

        document.querySelectorAll(".dropdown-toggle-admin")
            .forEach(btn => btn.classList.remove("active"));
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

    // =========================
    // GENERAZIONE ORARI PROGRAMMAZIONE
    // =========================

    let orariContainer = document.querySelector(".orari-grid");

    if(orariContainer){
        let start = 11 * 60;
        let end = 25 * 60; // 01:00 del giorno dopo

        for(let minuti = start; minuti <= end; minuti += 10){
            let ore = Math.floor(minuti / 60);
            let min = minuti % 60;

            if(ore >= 24){
                ore -= 24;
            }

            let oraFormattata =
                String(ore).padStart(2,"0")
                + ":" +
                String(min).padStart(2,"0");

            orariContainer.innerHTML += `
                <div class="form-check">
                    <input
                        class="form-check-input"
                        type="checkbox"
                        name="orari"
                        value="${oraFormattata}"
                        id="ora-${oraFormattata}">

                    <label
                        class="form-check-label"
                        for="ora-${oraFormattata}">
                        ${oraFormattata}
                    </label>
                </div>
            `;
        }

    }
});