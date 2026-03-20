const solveBtn     = document.getElementById("solveBtn");
const resetBtn     = document.getElementById("resetBtn");
const genValEl     = document.getElementById("genVal");
const fitValEl     = document.getElementById("fitVal");
const statusEl     = document.getElementById("status");
const chessboard   = document.getElementById("chessboard");

const POPULATION_SIZE = 200;
const MUTATION_RATE   = 0.01;

let population = [];
let isSolving  = false;

// ── Board setup ──────────────────────────────────────────────────────────────

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

function renderBoard(solution) {
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const td = chessboard.rows[r].cells[c];
      const base = (r + c) % 2 === 0 ? "light" : "dark";
      td.className = base;
      td.textContent = "";
      if (solution && solution[r] === c) {
        td.classList.add("queen");
        td.textContent = "♛";
      }
    }
  }
}

// ── GA helpers ───────────────────────────────────────────────────────────────

const randomSolution = () => Array.from({length: 8}, () => Math.floor(Math.random() * 8));

function fitness(sol) {
  let conflicts = 0;
  for (let i = 0; i < 8; i++)
    for (let j = i + 1; j < 8; j++)
      if (sol[i] === sol[j] || Math.abs(sol[i] - sol[j]) === j - i)
        conflicts++;
  return conflicts;
}

function initPopulation() {
  population = Array.from({length: POPULATION_SIZE}, randomSolution);
}

// Tournament selection: pick best of 5 random candidates
function tournament() {
  let best = population[Math.floor(Math.random() * POPULATION_SIZE)];
  for (let i = 1; i < 5; i++) {
    const candidate = population[Math.floor(Math.random() * POPULATION_SIZE)];
    if (fitness(candidate) < fitness(best)) best = candidate;
  }
  return best;
}

function nextGeneration() {
  // Keep top 10% (elitism)
  const sorted = [...population].sort((a, b) => fitness(a) - fitness(b));
  const eliteCount = Math.floor(POPULATION_SIZE * 0.1);
  const newPop = sorted.slice(0, eliteCount);

  while (newPop.length < POPULATION_SIZE) {
    const p1 = tournament(), p2 = tournament();
    const cut = Math.floor(Math.random() * 8);
    const child = p1.slice(0, cut).concat(p2.slice(cut));
    for (let g = 0; g < 8; g++)
      if (Math.random() < MUTATION_RATE) child[g] = Math.floor(Math.random() * 8);
    newPop.push(child);
  }
  population = newPop;
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

// ── Solve ────────────────────────────────────────────────────────────────────

async function solve() {
  // FIX: reset state at the start of every solve run
  initPopulation();
  let generation  = 0;
  let bestFitness = Infinity;
  let snapshots   = [];   // FIX: local array, not shared global

  isSolving = true;
  solveBtn.disabled = true;
  resetBtn.disabled = true;
  statusEl.className = "running";
  statusEl.textContent = "Running…";
  fitValEl.className = "value";

  // Evolution loop with stagnation restart
  let stagnation = 0;
  const STAGNATION_LIMIT = 100;

  while (bestFitness > 0) {
    const prevBest = bestFitness;
    for (const child of population) {
      const f = fitness(child);
      if (f < bestFitness) {
        bestFitness = f;
        snapshots.push({ sol: [...child], gen: generation });
      }
    }

    if (bestFitness < prevBest) stagnation = 0;
    else stagnation++;

    // Restart with fresh population if stuck
    if (stagnation >= STAGNATION_LIMIT) {
      initPopulation();
      stagnation = 0;
    }

    generation++;
    genValEl.textContent = generation;
    fitValEl.textContent = bestFitness;
    if (generation % 10 === 0) await sleep(0);
    if (bestFitness > 0) nextGeneration();
  }

  // Replay snapshots
  for (const { sol, gen } of snapshots) {
    renderBoard(sol);
    genValEl.textContent = gen + 1;
    await sleep(50);
  }

  fitValEl.className = "value success";
  statusEl.className = "done";
  statusEl.textContent = `Solved in ${generation} generation${generation !== 1 ? "s" : ""}!`;
  isSolving = false;
  solveBtn.disabled = false;
  resetBtn.disabled = false;
}

// ── Reset ────────────────────────────────────────────────────────────────────

function reset() {
  initPopulation();
  renderBoard(null);
  genValEl.textContent = "0";
  fitValEl.textContent = "—";
  fitValEl.className = "value";
  statusEl.className = "";
  statusEl.textContent = "Press Solve to start.";
}

// ── Init ─────────────────────────────────────────────────────────────────────

buildBoard();
initPopulation();
solveBtn.addEventListener("click", solve);
resetBtn.addEventListener("click", reset);
