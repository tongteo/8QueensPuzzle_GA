const solveBtn   = document.getElementById("solveBtn");
const resetBtn   = document.getElementById("resetBtn");
const genValEl   = document.getElementById("genVal");
const fitValEl   = document.getElementById("fitVal");
const statusEl   = document.getElementById("status");
const chessboard = document.getElementById("chessboard");

const POPULATION_SIZE   = 200;
const MUTATION_RATE     = 0.01;
const STAGNATION_LIMIT  = 100;

let population = [];
let rafId      = null; // requestAnimationFrame handle

// ── Board ────────────────────────────────────────────────────────────────────

function buildBoard() {
  chessboard.innerHTML = "";
  for (let r = 0; r < 8; r++) {
    const tr = chessboard.insertRow();
    for (let c = 0; c < 8; c++) {
      const td = tr.insertCell();
      td.className = (r + c) % 2 === 0 ? "light" : "dark";
    }
  }
}

function clearBoard() {
  for (let r = 0; r < 8; r++)
    for (let c = 0; c < 8; c++) {
      const td = chessboard.rows[r].cells[c];
      td.className = (r+c)%2===0 ? "light" : "dark";
      td.textContent = "";
    }
  _prev = null;
}

let _prev = null;
function renderBoard(sol) {
  for (let r = 0; r < 8; r++) {
    const p = _prev ? _prev[r] : -1;
    const c = sol   ? sol[r]   : -1;
    if (p === c) continue;
    if (p >= 0) { const td = chessboard.rows[r].cells[p]; td.className = (r+p)%2===0?"light":"dark"; td.textContent=""; }
    if (c >= 0) { const td = chessboard.rows[r].cells[c]; td.className = ((r+c)%2===0?"light":"dark")+" queen"; td.textContent="♛"; }
  }
  _prev = sol ? [...sol] : null;
}

// ── GA ───────────────────────────────────────────────────────────────────────

const rand8 = () => Math.floor(Math.random() * 8);
const randPop = () => Array.from({length: 8}, rand8);

function fitness(sol) {
  let n = 0;
  for (let i = 0; i < 8; i++)
    for (let j = i+1; j < 8; j++)
      if (sol[i]===sol[j] || Math.abs(sol[i]-sol[j])===j-i) n++;
  return n;
}

function initPopulation() {
  population = Array.from({length: POPULATION_SIZE}, randPop);
}

function tournament() {
  let best = population[Math.floor(Math.random()*POPULATION_SIZE)];
  for (let i=1; i<5; i++) {
    const c = population[Math.floor(Math.random()*POPULATION_SIZE)];
    if (fitness(c) < fitness(best)) best = c;
  }
  return best;
}

function nextGeneration() {
  const sorted = [...population].sort((a,b) => fitness(a)-fitness(b));
  const newPop = sorted.slice(0, Math.floor(POPULATION_SIZE*0.1));
  while (newPop.length < POPULATION_SIZE) {
    const cut = Math.floor(Math.random()*8);
    const child = tournament().slice(0,cut).concat(tournament().slice(cut));
    for (let g=0; g<8; g++) if (Math.random()<MUTATION_RATE) child[g]=rand8();
    newPop.push(child);
  }
  population = newPop;
}

// ── Solve loop via rAF ───────────────────────────────────────────────────────

function solve() {
  if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
  initPopulation();
  _prev = null;
  clearBoard();
  let generation  = 0;
  let bestFitness = Infinity;
  let bestSol     = null;
  let stagnation  = 0;

  solveBtn.disabled = true;
  resetBtn.disabled = true;
  statusEl.className = "running";
  statusEl.textContent = "Running…";
  fitValEl.className = "value";

  function step() {
    // Run several generations per frame to balance speed vs responsiveness
    for (let batch = 0; batch < 5; batch++) {
      const prevBest = bestFitness;

      for (const child of population) {
        const f = fitness(child);
        if (f < bestFitness) { bestFitness = f; bestSol = [...child]; }
      }

      stagnation = bestFitness < prevBest ? 0 : stagnation + 1;
      if (stagnation >= STAGNATION_LIMIT) { initPopulation(); stagnation = 0; }

      generation++;
      if (bestFitness > 0) nextGeneration();
      if (bestFitness === 0) break;
    }

    // Update UI once per frame
    genValEl.textContent = generation;
    fitValEl.textContent = bestFitness === Infinity ? "—" : bestFitness;
    if (bestSol) renderBoard(bestSol);

    if (bestFitness > 0) {
      rafId = requestAnimationFrame(step);
    } else {
      fitValEl.className = "value success";
      statusEl.className = "done";
      statusEl.textContent = `Solved in ${generation} generation${generation!==1?"s":""}!`;
      solveBtn.disabled = false;
      resetBtn.disabled = false;
    }
  }

  rafId = requestAnimationFrame(step);
}

// ── Reset ────────────────────────────────────────────────────────────────────

function reset() {
  if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
  initPopulation();
  clearBoard();
  genValEl.textContent = "0";
  fitValEl.textContent = "—";
  fitValEl.className = "value";
  statusEl.className = "";
  statusEl.textContent = "Press Solve to start.";
  solveBtn.disabled = false;
  resetBtn.disabled = false;
}

// ── Init ─────────────────────────────────────────────────────────────────────

buildBoard();
initPopulation();
solveBtn.addEventListener("click", solve);
resetBtn.addEventListener("click", reset);
