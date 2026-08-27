// const canvas = document.getElementById("moonCanvas");
// const ctx = canvas.getContext("2d");

//first version of the code, make a white circle
//ctx.beginPath(); //take the pencil
//ctx.arc(150, 150, 100, 0, Math.PI * 2); //make a circle
//ctx.fillStyle = "white";
//ctx.fill();




//2nd version, two layers for the moon and its phases.
// const cx = 150;  // center x
// const cy = 150;  // center y
// const r = 100;    // radius

//dark base
// ctx.beginPath();
// ctx.arc(cx, cy, r, 0, Math.PI * 2);
// ctx.fillStyle = "#1A2035";
// ctx.fill();

// ctx.beginPath();
// ctx.arc(cx, cy, r, -Math.PI / 2, Math.PI / 2); // right half arc
// ctx.closePath();
// ctx.fillStyle = "#F0E6D2"; // pale moonlight color
// ctx.fill();


// const phase = 0.15; // can change between 0 and 1

// const rx = r * Math.abs(Math.cos(phase * 2 * Math.PI));
// const isCrescent = Math.cos(phase * 2 * Math.PI) > 0;

// light half 
// ctx.beginPath();
// ctx.arc(cx, cy, r, -Math.PI / 2, Math.PI / 2);
// ctx.closePath();
// ctx.fillStyle = "#F0E6D2";
// ctx.fill();

// the ellipse either ADDS light (gibbous) or SUBTRACTS it (crescent)
// ctx.beginPath();
// ctx.ellipse(cx, cy, rx, r, 0, 0, Math.PI * 2);
// ctx.fillStyle = isCrescent ? "#1A2035" : "#F0E6D2";
// ctx.fill();

//cycle calculation (see notes)
//  const SYNODIC_MONTH = 29.530588861;
//  const REF_NEW_MOON = Date.UTC(2000, 0, 6, 18, 14, 0);

//  function getPhase(date) {
// const daysSinceRef = (date.getTime() - REF_NEW_MOON) / 86400000;
// let phase = (daysSinceRef % SYNODIC_MONTH) / SYNODIC_MONTH;
// if (phase < 0) phase += 1;
// return phase; 
//  }
//  const phase = getPhase(new Date());




//  Reorder Time
const canvas = document.getElementById("moonCanvas");
const ctx = canvas.getContext("2d");

const cx = 150;
const cy = 150;
const r = 140;

const SYNODIC_MONTH = 29.530588861;
const REF_NEW_MOON = Date.UTC(2000, 0, 6, 18, 14, 0);

function getPhase(date) {
    const daysSinceRef = (date.getTime() - REF_NEW_MOON) / 86400000;
    let phase = (daysSinceRef % SYNODIC_MONTH) / SYNODIC_MONTH;
    if (phase < 0) phase += 1;
    return phase;
}

const phase = getPhase(new Date());
//Illumination formula
function getIllumination(phase) {
    return (1 - Math.cos(phase * 2 * Math.PI)) / 2;
}
const rx = r * Math.abs(Math.cos(phase * 2 * Math.PI));
const isCrescent = Math.cos(phase * 2 * Math.PI) > 0;
//addition of waxing and waning cycle
const baseRight = phase < 0.5; //true = waxing (light on right), false = waning (light a gauche)
// dark base circle
ctx.beginPath();
ctx.arc(cx, cy, r, 0, Math.PI * 2);
ctx.fillStyle = "#1A2035";
ctx.fill();
//light half (now also picks left for waxing or right for waning)

ctx.beginPath();
if (baseRight) {
    ctx.arc(cx, cy, r, -Math.PI / 2, Math.PI / 2); //droite
} else {
    ctx.arc(cx, cy, r, Math.PI / 2, (3 * Math.PI) / 2); //gauche
}
ctx.closePath();
ctx.fillStyle = "#F0E6D2";
ctx.fill();

ctx.beginPath();
ctx.ellipse(cx, cy, rx, r, 0, 0, Math.PI * 2);
ctx.fillStyle = isCrescent ? "#1A2035" : "#F0E6D2";
ctx.fill();

function getPhaseName(phase) {
    if (phase < 0.02 || phase > 0.98) return "New Moon";
    if (phase < 0.24) return "Waxing Crescent";
    if (phase < 0.26) return "First Quarter";
    if (phase < 0.49) return "Waxing Gibbous";
    if (phase < 0.51) return "Full Moon";
    if (phase < 0.74) return "Waning Gibbous";
    if (phase < 0.76) return "Last Quarter";
    return "Waning Crescent";
}

const illum = getIllumination(phase)
const name = getPhaseName(phase)

document.getElementById("illumText").textContent = Math.round(illum * 100) + "% illuminated";
document.getElementById("nameText").textContent = name;

//stars
const starsCanvas = document.getElementById("stars");
const sctx = starsCanvas.getContext("2d"); //pencil to draw

starsCanvas.width = window.innerWidth;
starsCanvas.height = window.innerHeight;
//loop to make 150 stars
const stars = [];
for (let i = 0; i < 150; i++) {
    stars.push({//each star has these 5 propreties
        x: Math.random() * starsCanvas.width,
        y: Math.random() * starsCanvas.height,
        radius: Math.random() * 1.2 + 0.3,
        speed: Math.random() * 0.005 + 0.001,
        phase: Math.random() * Math.PI * 2,
    });
}

function drawStars(time) {
    sctx.clearRect(0, 0, starsCanvas.width, starsCanvas.height);
    for (const star of stars) {
        const twinkle = 0.5 + 0.5 * Math.sin(time * star.speed + star.phase);
        sctx.beginPath();
        sctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        sctx.fillStyle = `rgba(232, 230, 222, ${twinkle})`;
        sctx.fill();
    }
    requestAnimationFrame(drawStars);
}
requestAnimationFrame(drawStars);

//age lune et prochaine new moon

function findNextPhaseDate(fromDate, targetPhase) {
    const dayMs = 86400000;
    let time = fromDate.getTime();
    let prevPhase = getPhase(new Date(time));

    for (let i = 0; i < 40; i++) {
        time += dayMs;
        const currentPhase = getPhase(new Date(time));

        if (targetPhase === 0) {
            if (currentPhase < prevPhase) return new Date(time);
        } else if (prevPhase < targetPhase && currentPhase >= targetPhase) {
            return new Date(time);
        }
        prevPhase = currentPhase;
    }
    return null;
}

const ageDays = phase * SYNODIC_MONTH;
const nextFull = findNextPhaseDate(new Date(), 0.5);
const nextNew = findNextPhaseDate(new Date(), 0);

document.getElementById("ageText").textContent = ageDays.toFixed(1) + " days old";
document.getElementById("nextFullText").textContent = "Next Full Moon: " + nextFull.toLocaleDateString();
document.getElementById("nextNewText").textContent = "Next New Moon: " + nextNew.toLocaleDateString();

//les cratères
function mulberry32(seed) {
    return function () {
        seed |= 0;
        seed = (seed + 0x6D2B79F5) | 0;
        let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}



function drawCraters(cx, cy, r, seed) {
    const rand = mulberry32(seed);
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.clip();

    for (let i = 0; i < 14; i++) {
        const angle = rand() * Math.PI * 2;
        const dist = rand() * r * 0.85;
        const craterR = r * (0.04 + rand() * 0.09);
        const px = cx + Math.cos(angle) * dist;
        const py = cy + Math.sin(angle) * dist;

        ctx.beginPath();
        ctx.arc(px, py, craterR, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0,0,0,0.07)";
        ctx.fill();
    }
    ctx.restore();
}

drawCraters(cx, cy, r, 42);


//for the animation of the dunes(scroll-reveal)
// const observer = new IntersectionObserver((entries) => {
// entries.forEach((entry) => {
// if (entry.isIntersecting) {
// groundSection.classList.add("visible");
// tabBar.classList.add("visible");
// }
// });
// }, { threshold: 0.2 });

//observer.observe(groundSection);


//now moon event toogle where everything apears and disapears
const moonInfo = document.getElementById("moonInfo");
const groundSection = document.querySelector(".ground");
const tabBar = document.querySelector(".tab-bar");

canvas.addEventListener("click", () => {
    canvas.classList.toggle("shrink");
    moonInfo.classList.toggle("open");
    groundSection.classList.toggle("visible");
    tabBar.classList.toggle("visible");
});

//moonbutton
// const moonInfo = document.getElementById("moonInfo");

// canvas.addEventListener("click", () => {
//   moonInfo.classList.toggle("open");
// });

//checks if the browser even supports service workers
if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("sw.js").catch((err) => {
            console.log("Service worker failed:", err);
        });
    });
}


//TODO 
//Todo panel open/close
const todoView = document.getElementById("todoView");
const openTodoBtn = document.getElementById("openTodo");
const closeTodoBtn = document.getElementById("closeTodo");

openTodoBtn.addEventListener("click", () => {
    todoView.classList.add("open");
});

closeTodoBtn.addEventListener("click", () => {
    todoView.classList.remove("open");
});

//data save
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
    todoList.innerHTML = "";

    tasks.forEach((task, index) => {
        const li = document.createElement("li");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.done;
        checkbox.addEventListener("change", () => {
            tasks[index].done = checkbox.checked;
            saveTasks();
            renderTasks();
        });

        const span = document.createElement("span");
        span.textContent = task.text;
        if (task.done) {
            span.style.textDecoration = "line-through";
            span.style.opacity = "0.5";
        }

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "X";
        deleteBtn.addEventListener("click", () => {
            tasks.splice(index, 1);
            saveTasks();
            renderTasks();
        });
        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(deleteBtn);
        todoList.appendChild(li);
    });
}

const todoForm = document.getElementById("todoForm");
const todoInput = document.getElementById("todoInput");
const todoList = document.getElementById("todoList");

todoForm.addEventListener("submit", (event) => {
    event.preventDefault(); // stop the page from reloading (default form behavior)

    const text = todoInput.value.trim();
    if (text === "") return; // ignore empty submissions

    tasks.push({ text: text, done: false });
    saveTasks();
    renderTasks();

    todoInput.value = ""; // clear the input for the next task
});

renderTasks(); // draw whatever was already saved, on page load

//BOOKS FEATURE
//Books panel open/close
const booksView = document.getElementById("booksView");
const openBooksBtn = document.getElementById("openBooks");
const closeBooksBtn = document.getElementById("closeBooks");

openBooksBtn.addEventListener("click", () => {
    booksView.classList.add("open");
});

closeBooksBtn.addEventListener("click", () => {
    booksView.classList.remove("open");
});

//stars
//star picker
const starPicker = document.getElementById("starPicker");
const ratingStars = starPicker.querySelectorAll(".star");
let selectedRating = 0;

ratingStars.forEach((star) => {
    star.addEventListener("click", () => {
        selectedRating = parseInt(star.dataset.value);
        updateStars();
    });
});

function updateStars() {
    ratingStars.forEach((star) => {
        const value = parseInt(star.dataset.value);
        star.classList.toggle("selected", value <= selectedRating);
    });
}

//manga reader
const mangaView = document.getElementById("mangaView");
const openMangaBtn = document.getElementById("openManga");
const closeMangaBtn = document.getElementById("closeManga");

openMangaBtn.addEventListener("click", () => {
    mangaView.classList.add("open");
});

closeMangaBtn.addEventListener("click", () => {
    mangaView.classList.remove("open");
});

pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

const mangaInput = document.getElementById("mangaInput");
const mangaImage = document.getElementById("mangaImage");
const pageCounter = document.getElementById("pageCounter");
const prevPageBtn = document.getElementById("prevPage");
const nextPageBtn = document.getElementById("nextPage");
const mangaCanvas = document.getElementById("mangaCanvas");
const mangaCtx = mangaCanvas.getContext("2d");

let pdfDoc = null;
let imagePages = [];
let currentPage = 0;
mode = "pdf"; 
let mode = null;

mangaInput.addEventListener("change", async (event) => {
  const files = Array.from(event.target.files);
  if (files.length === 0) return;

if (files[0].type === "application/pdf") {
    mode = "pdf";
    const arrayBuffer = await files[0].arrayBuffer();
    pdfDoc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    currentPage = 1;
    mangaCanvas.style.display = "block";
    mangaImage.style.display = "none";
    renderPage();
  } else {
    mode = "images";
    imagePages = files.map((file) => URL.createObjectURL(file));
    currentPage = 1;
    mangaCanvas.style.display = "none";
    mangaImage.style.display = "block";
    renderPage();
  }
});

async function renderPage() {
  if (mode === "pdf") {
    if (!pdfDoc) return;
    const page = await pdfDoc.getPage(currentPage);
    const viewport = page.getViewport({ scale: 1.5 });
    mangaCanvas.width = viewport.width;
    mangaCanvas.height = viewport.height;
    await page.render({ canvasContext: mangaCtx, viewport: viewport }).promise;
    pageCounter.textContent = `Page ${currentPage} of ${pdfDoc.numPages}`;
  } else if (mode === "images") {
    if (imagePages.length === 0) return;
    mangaImage.src = imagePages[currentPage - 1];
    pageCounter.textContent = `Page ${currentPage} of ${imagePages.length}`;
  }
}


function totalPages() {
  return mode === "pdf" ? pdfDoc.numPages : imagePages.length;
}


prevPageBtn.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    renderPage();
  }
});

nextPageBtn.addEventListener("click", () => {
  if (mode && currentPage < totalPages()) {
    currentPage++;
    renderPage();
  }
});