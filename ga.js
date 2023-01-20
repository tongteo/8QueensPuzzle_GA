const chessboard = document.getElementById("chessboard");
const solveBtn = document.getElementById("solveBtn");
const resetBtn = document.getElementById("resetBtn");
const generationEl = document.getElementById("generation");

let population = [];
let populationSize = 200;
let generation = 0;
let mutationRate = 0.01;

// Create the initial population of solutions
function initPopulation() {
  for (let i = 0; i < populationSize; i++) {
    population.push(createSolution());
  }
}

// Create a random solution
function createSolution() {
  let solution = [];
  for (let i = 0; i < 8; i++) {
    solution.push(Math.floor(Math.random() * 8));
  }
  return solution;
}

// Evaluate the fitness of a solution
function evaluateFitness(solution) {
  let fitness = 0;
  for (let i = 0; i < 8; i++) {
    for (let j = i + 1; j < 8; j++) {
      if (solution[i] === solution[j]) {
        fitness++;
      }
      if (Math.abs(solution[i] - solution[j]) === Math.abs(i - j)) {
        fitness++;
      }
    }
  }
  return fitness;
}

// Select two parents for crossover
function selection() {
  let parent1 = population[Math.floor(Math.random() * populationSize)];
  let parent2 = population[Math.floor(Math.random() * populationSize)];
  return [parent1, parent2];
}

// Perform crossover on the parents
function crossover(parents) {
  let parent1 = parents[0];
  let parent2 = parents[1];
  let crossoverPoint = Math.floor(Math.random() * 8);
  let child = parent1.slice(0, crossoverPoint).concat(parent2.slice(crossoverPoint));
  return child;
}

// Perform mutation on a child
function mutation(child) {
  for (let i = 0; i < 8; i++) {
    if (Math.random() < mutationRate) {
      child[i] = Math.floor(Math.random() * 8);
    }
  }
  return child;
}

// Update the chessboard with a solution
function updateChessboard(solution) {
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      let cell = chessboard.rows[i].cells[j];
      if (solution[i] === j) {
        cell.classList.add("queen");
        cell.classList.remove("empty");
      } else {
        cell.classList.add("empty");
        cell.classList.remove("queen");
          }
      }
    }
}

async function sleep(ms) {
  await new Promise(resolve => setTimeout(resolve, ms));
}

// Solve the 8 queen problem using genetic algorithm
let solutions = [];

// Solve the 8 queen problem using genetic algorithm
async function solve() {
  let bestSolution;
  let bestFitness = 8;
  while (bestFitness > 0) {
    let newPopulation = [];
    for (let i = 0; i < populationSize; i++) {
      let parents = selection();
      let child = crossover(parents);
      child = mutation(child);
      let fitness = evaluateFitness(child);
      if (fitness < bestFitness) {
        bestFitness = fitness;
        bestSolution = child;
        solutions.push(bestSolution);
      }
      newPopulation.push(child);
    }
    population = newPopulation;
    generation++;
  }
  for (let i = 0; i < solutions.length; i++) {
    updateChessboard(solutions[i]);
    generationEl.innerHTML = "Generation: " + (i+1);
    await sleep(40);
  }
}

// Reset the chessboard
function reset() {
for (let i = 0; i < 8; i++) {
for (let j = 0; j < 8; j++) {
let cell = chessboard.rows[i].cells[j];
cell.classList.remove("queen");
cell.classList.add("empty");
}
}
generation = 0;
population = [];
initPopulation();
}

// Initialize the population and add event listeners
initPopulation();
solveBtn.addEventListener("click", solve);
resetBtn.addEventListener("click", reset);
