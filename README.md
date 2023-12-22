# 8 Queens Puzzle Solver using Genetic Algorithm

## Overview
This project implements a solution to the classic 8 Queens Puzzle using a Genetic Algorithm (GA). The 8 Queens Puzzle involves placing eight queens on an 8x8 chessboard so that no two queens threaten each other. Our approach uses evolutionary techniques to iteratively improve the placement of queens.

## Features
- **Genetic Algorithm Implementation**: Utilizes genetic operators like selection, crossover, and mutation to find a solution.
- **Customizable Parameters**: Allows tweaking of GA parameters such as population size, mutation rate, etc.
- **Performance Metrics**: Tracks and displays the performance of the algorithm over iterations.

## Getting Started

### Prerequisites
- Ensure you have [Python](https://www.python.org/downloads/) installed on your machine.

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/tongteo/8QueensPuzzle_GA.git
   ```
2. Navigate to the project directory:
   ```bash
   cd 8QueensPuzzle_GA
   ```

### Usage
Run the main script to start the algorithm:
```bash
python main.py
```

## How It Works
The program initializes a population of random solutions (queen placements). Each generation, it evaluates these solutions based on a fitness function that counts the number of non-attacking pairs of queens. The best solutions are selected to reproduce using crossover and mutation, producing a new generation of solutions. This process repeats until a solution is found or a maximum number of generations is reached.

## Contributing
Contributions to this project are welcome. Please fork the repository and submit a pull request with your changes.

## License
This project is open-sourced under the [MIT License](LICENSE).

## Acknowledgments
- Special thanks to all contributors and supporters of this project.
