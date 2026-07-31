document.addEventListener("DOMContentLoaded", function () {
    /*
    ======================================
        GESTIONE BOTTONI GIORNI
    ======================================
  */

const buttons = document.querySelectorAll(".cinema-tabs .nav-link");
const dayButtons = Array.from(buttons).filter(btn => !btn.dataset.tutti);

const today = new Date();
const days = [
    "Dom",
    "Lun",
    "Mar",
    "Mer",
    "Gio",
    "Ven",
    "Sab"
];

dayButtons.forEach((btn,index)=>{
    let date = new Date();
    date.setDate(today.getDate()+index);

    if(index===0){
        btn.textContent="Oggi";
    }
    else if(index===1){
        btn.textContent="Domani";
    }
    else{
        btn.textContent=days[date.getDay()];
    }

    btn.dataset.index=index;
});



/*
======================================
    CARICAMENTO INIZIALE OGGI
======================================
*/

let oggi = formatDate(new Date());
renderProgrammazioni(PROGRAMMAZIONI[oggi]);

/*
    ======================================
        FORMATTAZIONE DATA
    ======================================
    */
    function formatDate(date){

        let year = date.getFullYear();
        let month = String(date.getMonth()+1).padStart(2,"0");
        let day = String(date.getDate()).padStart(2,"0");

        return `${year}-${month}-${day}`;
    }
/*
======================================
    CLICK GIORNI
======================================
*/

dayButtons.forEach(button=>{
    button.addEventListener("click",function(){
        buttons.forEach(btn=>{
            btn.classList.remove("active");
        });
        this.classList.add("active");

        let index = Number(this.dataset.index);
        let data = new Date();

        data.setDate(data.getDate()+index);
        let chiave = formatDate(data);

        renderProgrammazioni(
            PROGRAMMAZIONI[chiave]
        );
    });
});

/*
======================================
    CLICK TUTTI
======================================
*/
const tuttiButton = document.querySelector(".giorno-tutti");
tuttiButton.addEventListener("click",()=>{
    buttons.forEach(btn=>{
        btn.classList.remove("active");
    });

    tuttiButton.classList.add("active");

    renderProgrammazioni(
        TUTTE_PROGRAMMAZIONI
    );
});

    /*
    ======================================
        OFFERTE TOP 3
    ======================================
    */

    fetch("/offerte/top3")
        .then(response => response.json())
        .then(data => {
            let container =
                document.getElementById(
                    "offerte-container"
                );
            if(!container){
                return;
            }

            container.innerHTML = "";
            data.forEach(offerta => {
                container.innerHTML += `
                <div class="col-lg-4 mt-4">
                    <div class="card">
                        <div class="card-img-wrap">
                            <img src="${offerta.imgBanner}"
                                 class="card-img-novita">
                        </div>

                        <div class="card-body">
                            <h5>
                                ${offerta.nome}
                            </h5>

                            <a href="/offerte/dettagliOfferte/${offerta.id}">
                                Leggi di più
                            </a>
                        </div>
                    </div>
                </div>
                `;
            });
        })

        .catch(error => {
            console.error(
                "Errore offerte:",
                error
            );
        });


            /*
            ======================================
                RENDER CARD PROGRAMMAZIONI
            ======================================
            */

            function renderProgrammazioni(lista){

                let container = document.getElementById("programmazione-container");

                if(!container){
                    return;
                }

                container.innerHTML = "";

                if(!lista || lista.length === 0){
                    container.innerHTML = `
                        <div class="text-white">
                            Nessuna programmazione disponibile
                        </div>
                    `;
                    return;
                }
                lista.forEach(prog => {
                    let card = `
                    <article class="col-6 col-md-4 col-lg-3 show-column">
                        <div class="show-card">
                            <div class="session-time">
                                <time class="start">
                                    ${prog.orarioInizio}
                                </time>
                                <span class="separator">
                                    -
                                </span>
                                <time class="end">
                                    ${prog.orarioFine}
                                </time>
                            </div>

                            <div class="meta-line">
                                <span class="label">
                                    Sala
                                </span>

                                <span class="value">
                                    ${prog.idSala}
                                </span>
                            </div>

                            <div class="projection-line">
                                <span class="label">
                                    Proiezione
                                </span>
                                <span class="value">
                                    ${prog.formato.nome}
                                </span>
                            </div>

                            <div class="price-line">
                                <span class="from">
                                    Da
                                </span>
                                <strong class="price">
                                    ${prog.prezzo} €
                                </strong>
                            </div>
                        </div>
                    </article>
                    `;

                    container.innerHTML += card;
                });
            }
        console.log(PROGRAMMAZIONI);
        console.log(TUTTE_PROGRAMMAZIONI);
        console.log(oggi);
        console.log(buttons);
        console.log(dayButtons);
        console.log(tuttiButton);
});