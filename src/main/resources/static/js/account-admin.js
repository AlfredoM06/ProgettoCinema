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

});