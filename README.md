# 8 Queens Puzzle — Genetic Algorithm

Solves the classic 8 Queens Puzzle using a Genetic Algorithm. Place 8 queens on an 8×8 chessboard so no two queens threaten each other.

## How It Works

- Initializes a population of 200 random solutions
- Each generation: tournament selection → crossover → mutation
- Elitism (top 10%) preserves the best solutions each generation
- Auto-restarts with a fresh population after 100 stagnant generations to avoid local optima
- Animates the improvement steps once a solution is found

## Usage

Open `index.html` in a browser, or run a local server:

```bash
python -m http.server
```

Then visit `http://localhost:8000`.

## Parameters

| Parameter | Value |
|---|---|
| Population size | 200 |
| Mutation rate | 1% |
| Elitism | 10% |
| Stagnation restart | 100 generations |

## License

MIT
