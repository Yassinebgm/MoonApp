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
const r = 100;

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