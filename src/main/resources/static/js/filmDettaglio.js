document.addEventListener("DOMContentLoaded", function () {

    let buttons = document.querySelectorAll(".cinema-tabs .nav-link");

    let today = new Date();
    let days = ["Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"];

    // escludo l'ultimo (Tutti)
    let dayButtons = Array.from(buttons).slice(0, -1);

    dayButtons.forEach((btn, index) => {

        let date = new Date();
        date.setDate(today.getDate() + index);

        let dayName = days[date.getDay()];

        if (index === 0) {
            btn.textContent = "Oggi";
        }
        else if (index === 1) {
            btn.textContent = "Domani";
        }
        else {
            btn.textContent = dayName;
        }

    });

    // fisso "Tutti"
    let allBtn = buttons[buttons.length - 1];
    allBtn.textContent = "Tutti";

});
