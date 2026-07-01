document.addEventListener("DOMContentLoaded", () => {

  let modal = document.getElementById("cineModal");

  let modalImg = document.getElementById("modal-img");
  let modalTitle = document.getElementById("modal-title");
  let modalPrice = document.getElementById("modal-price");
  let modalDesc = document.getElementById("modal-desc");

  let acc1 = document.getElementById("acc-1");
  let acc2 = document.getElementById("acc-2");
  let acc3 = document.getElementById("acc-3");

  modal.addEventListener("show.bs.modal", (event) => {

    let card = event.relatedTarget;

    // MODAL DATA
    modalTitle.textContent = card.dataset.title;
    modalPrice.textContent = card.dataset.price;
    modalImg.src = card.dataset.img;
    modalDesc.textContent = card.dataset.desc;

    // ACCORDION DATA
    acc1.textContent = card.dataset.acc1;
    acc2.textContent = card.dataset.acc2;
    acc3.textContent = card.dataset.acc3;

  });

});