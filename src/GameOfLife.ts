import { Grid } from "./types";

export class GameOfLife {
  private grid: Grid;
  private rows: number;
  private cols: number;

  constructor(rows: number, cols: number) {
    this.rows = rows;
    this.cols = cols;
    this.grid = this.createEmptyGrid();
  }

  private createEmptyGrid(): Grid {
    return Array(this.rows)
      .fill(null)
      .map(() => Array(this.cols).fill(0));
  }

  public setCell(row: number, col: number, value: number): void {
    if (this.isValidPosition(row, col)) {
      this.grid[row][col] = value;
    }
  }

  public getCell(row: number, col: number): number {
    if (this.isValidPosition(row, col)) {
      return this.grid[row][col];
    }
    return 0;
  }

  private isValidPosition(row: number, col: number): boolean {
    return row >= 0 && row < this.rows && col >= 0 && col < this.cols;
  }

  private countNeighbors(row: number, col: number): number {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i === 0 && j === 0) continue;
        count += this.getCell(row + i, col + j);
      }
    }
    return count;
  }

  public nextGeneration(): void {
    const newGrid = this.createEmptyGrid();

    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        const neighbors = this.countNeighbors(row, col);
        const currentCell = this.getCell(row, col);
        newGrid[row][col] = this.determineNextState(currentCell, neighbors);
      }
    }

    this.grid = newGrid;
  }

  private determineNextState(currentState: number, neighbors: number): number {
    if (currentState === 1) {
      return neighbors === 2 || neighbors === 3 ? 1 : 0;
    }
    return neighbors === 3 ? 1 : 0;
  }

  public getGrid(): Grid {
    return this.grid.map((row) => [...row]);
  }

  public printGrid(): void {
    for (let row = 0; row < this.rows; row++) {
      console.log(this.grid[row].map((cell) => (cell ? "■" : "□")).join(" "));
    }
    console.log("\n");
  }
}
