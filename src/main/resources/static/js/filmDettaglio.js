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
renderProgrammazioni(PROGRAMMAZIONI[oggi], "OGGI");

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

    function formatHeaderDate(date){
        const giorni = ["DOMENICA","LUNEDI","MARTEDI","MERCOLEDI","GIOVEDI","VENERDI","SABATO"];
        const mesi = ["GEN","FEB","MAR","APR","MAG","GIU","LUG","AGO","SET","OTT","NOV","DIC"];

        let giornoSettimana = giorni[date.getDay()];
        let giorno = date.getDate();
        let mese = mesi[date.getMonth()];

        return `${giornoSettimana}, ${giorno} ${mese}`;
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
        let titolo;

        data.setDate(data.getDate()+index);

        if(index === 0){
                    titolo = "OGGI";
                } else {
                    titolo = formatHeaderDate(data);
                }

        let chiave = formatDate(data);

        renderProgrammazioni(
            PROGRAMMAZIONI[chiave], titolo
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

    renderTutteProgrammazioni(TUTTE_PROGRAMMAZIONI);
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
              HEADER DINAMICO X BOTTONI
        ======================================
        */
        function creaHeaderProgrammazione(titolo){

            return `
                <div class="show-header mb-3">
                    <div class="show-left">
                        <span class="show-label">
                            PROSSIMI SPETTACOLI PER
                        </span>

                        <time class="show-time">
                            ${titolo}
                        </time>
                    </div>

                    <p class="show-note">
                        1€ in meno se acquisti online
                    </p>
                </div>
            `;
        }
        /*
        ======================================
           RENDER CARD PROGRAMMAZIONI
        ======================================
        */
        function creaCardProgrammazione(prog){

        return `
            <article class="col-6 col-md-4 col-lg-3 show-column">
                <div class="show-card">
                    <div class="session-time">
                        <time class="start">
                            ${prog.orarioInizio.substring(0,5)}
                        </time>

                        <span class="separator">
                            -
                        </span>

                        <time class="end">
                            ${prog.orarioFine.substring(0,5)}
                        </time>
                    </div>


                <div class="meta-line">
                    <span class="label">
                        Sala
                    </span>

                    <span class="value">
                        ${prog.id_sala}
                    </span>
                </div>


                <div class="projection-line">
                    <span class="label">
                        Proiezione
                    </span>

                    <span class="value">
                        ${prog.formato}
                    </span>
                </div>


                <div class="price-line">
                    <span class="from">
                        Da
                    </span>
                    <strong class="price">
                        ${Number(prog.prezzo).toFixed(2).replace(".",",")} €
                    </strong>
                </div>
            </div>
        </article>
        `;
        }


            /*
            ======================================
                RENDER CARD PROGRAMMAZIONI
            ======================================
            */

            function renderProgrammazioni(lista, titolo){

                let container = document.getElementById("programmazione-list");

                if(!container){
                    return;
                }

                container.innerHTML="";
                    if(!lista || lista.length===0){
                        container.innerHTML=`

                        <div class="text-white">
                            Nessuna programmazione disponibile
                         </div>
                    `;
                return;
            }

            container.innerHTML += creaHeaderProgrammazione(titolo);

            lista.forEach(prog=>{
                container.innerHTML += creaCardProgrammazione(prog);
            });

            }

            /*
             ======================================
                RENDER CARD PROGRAMMAZIONI TUTTI
             ======================================
             */
            function renderTutteProgrammazioni(mappa){

                let container = document.getElementById("programmazione-list");

                if(!container){
                    return;
                }

                container.innerHTML = "";

                Object.entries(mappa).forEach(([data, programmi])=>{
                    if(programmi.length === 0){
                                return;
                            }

                    let giorno = new Date(data);
                    container.innerHTML += creaHeaderProgrammazione(formatHeaderDate(giorno));

                    programmi.forEach(prog=>{
                        container.innerHTML += creaCardProgrammazione(prog);
                    });
                });
            }

        console.log( PROGRAMMAZIONI);
        console.log(TUTTE_PROGRAMMAZIONI);
        console.log(oggi);
});