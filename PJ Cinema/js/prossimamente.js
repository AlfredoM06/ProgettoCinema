const cards = document.querySelectorAll('.card');

const moviePage = document.createElement('div');
moviePage.classList.add('movie-page');
document.body.appendChild(moviePage);

let descStarted = false;

// ======================================================
// INFO
// ======================================================
function triggerInfoAndButtons() {

  moviePage.querySelectorAll('.info li').forEach((el, i) => {

    setTimeout(() => {
      el.classList.add('show');

      el.querySelectorAll('button').forEach(btn => {
        btn.classList.add('show');
      });

    }, i * 150);
  });

}

// ======================================================
// ACTION BUTTONS (solo PRENOTA ORA)
// ======================================================
function triggerButtons() {

  const btn = moviePage.querySelector('.btn-slice');

  if (btn) {
    setTimeout(() => {
      btn.classList.add('show');
    }, 200);
  }
}

// ======================================================
// CLOSE X
// ======================================================
function triggerClose() {
  const close = moviePage.querySelector('.movie-close');

  setTimeout(() => {
    close.classList.add('show');
  }, 150);
}

// ======================================================
// DESCRIZIONE
// ======================================================
function animateDescriptionLines(container, text) {

  container.innerHTML = "";

  const words = text.split(" ");

  const measure = document.createElement("span");
  measure.style.visibility = "hidden";
  measure.style.position = "absolute";
  measure.style.whiteSpace = "nowrap";
  document.body.appendChild(measure);

  let lineText = "";
  const lines = [];

  words.forEach(word => {
    const testText = lineText + word + " ";
    measure.textContent = testText;

    if (measure.offsetWidth > container.offsetWidth) {
      lines.push(lineText.trim());
      lineText = word + " ";
    } else {
      lineText = testText;
    }
  });

  if (lineText) lines.push(lineText.trim());

  document.body.removeChild(measure);

  const triggerPoint = Math.floor(lines.length * 0.5);
  descStarted = false;

  lines.forEach((line, i) => {

    const span = document.createElement("span");
    span.classList.add("desc-line");
    span.textContent = line;

    container.appendChild(span);

    setTimeout(() => {
      span.classList.add("show");

      if (!descStarted && i >= triggerPoint) {
        descStarted = true;

        triggerInfoAndButtons();
        triggerButtons();
        triggerClose();
      }

    }, i * 140);
  });
}

// ======================================================
// OPEN MOVIE
// ======================================================
function openMovie(card) {
  document.body.classList.add("no-navbar");
  moviePage.classList.remove('active');

  const title = card.dataset.title;
  const desc = card.dataset.desc;
  const img = card.dataset.img;

  moviePage.innerHTML = `
    <div class="hero" style="background-image: url('${img}')"></div>

    <!-- X CLOSE -->
    <div class="movie-close">×</div>

    <main class="movie-layout">

      <section class="left">
        <h1 class="title"></h1>

        <ul class="info">
          <li><span>Cast</span><button>Zendaya, Chalamet</button></li>
          <li><span>Regia</span><button>D. Villeneuve</button></li>
          <li><span>Durata</span><button>2h 18m</button></li>
          <li><span>Data</span><button>Marzo 2024</button></li>
          <li><span>Rate</span><button>13+</button></li>
        </ul>
      </section>

      <section class="right">
        <div class="desc-box"></div>

        <div class="actions">
          <a href="#" class="btn-slice">
            <div class="top"><span>Prenota ora!</span></div>
            <div class="bottom"><span>Prenota ora!</span></div>
          </a>
        </div>
      </section>

    </main>
  `;

  requestAnimationFrame(() => {
    moviePage.classList.add('active');
  });

  const titleEl = moviePage.querySelector('.title');
  const descBox = moviePage.querySelector('.desc-box');

  titleEl.innerHTML = "";
  descBox.innerHTML = "";

  // TITLE
  const lines = title.split(":");

  lines.forEach((line, lineIndex) => {

    const row = document.createElement("div");
    row.classList.add("title-line");

    const text = line.trim() + (lineIndex === 0 && lines.length > 1 ? ":" : "");

    const words = text.split(" ");

    words.forEach((word, wordIndex) => {

      const wordEl = document.createElement("span");
      wordEl.classList.add("word");

      [...word].forEach((char, charIndex) => {

        const letter = document.createElement("span");
        letter.textContent = char === " " ? "\u00A0" : char;

        letter.style.animationDelay =
          `${(lineIndex * 0.1) + (wordIndex * 0.15) + (charIndex * 0.03)}s`;

        wordEl.appendChild(letter);
      });

      row.appendChild(wordEl);
    });

    titleEl.appendChild(row);
  });

  const titleDuration = title.length * 25;

  setTimeout(() => {
    animateDescriptionLines(descBox, desc);
  }, titleDuration + 250);

  // CLOSE CLICK
let isClosing = false;

moviePage.addEventListener('click', (e) => {
  if (!e.target.classList.contains('movie-close')) return;

  if (isClosing) return;
  isClosing = true;

  moviePage.classList.add('closing');
  moviePage.classList.remove('active');

  // sync con CSS transition
  setTimeout(() => {
  moviePage.innerHTML = "";
  moviePage.classList.remove('closing');

  document.body.classList.remove("no-navbar");
}, 800);
});
}

// EVENTS
cards.forEach(card => {
  card.addEventListener('click', () => openMovie(card));
});