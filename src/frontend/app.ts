interface GameState {
  grid: number[][];
  rows: number;
  cols: number;
}

class GameOfLifeGUI {
  private gridElement: HTMLElement;
  private startButton: HTMLButtonElement;
  private stopButton: HTMLButtonElement;
  private nextButton: HTMLButtonElement;
  private intervalId: number | null = null;
  private readonly apiUrl: string = "http://localhost:3000";

  constructor() {
    this.gridElement = document.getElementById("grid") as HTMLElement;
    this.startButton = document.getElementById("startBtn") as HTMLButtonElement;
    this.stopButton = document.getElementById("stopBtn") as HTMLButtonElement;
    this.nextButton = document.getElementById("nextBtn") as HTMLButtonElement;

    this.initializeEventListeners();
    this.initializeGame();
  }

  private initializeEventListeners(): void {
    this.startButton.addEventListener("click", () => this.startSimulation());
    this.stopButton.addEventListener("click", () => this.stopSimulation());
    this.nextButton.addEventListener("click", () => this.nextGeneration());
  }

  private async initializeGame(): Promise<void> {
    try {
      const response = await fetch(`${this.apiUrl}/game`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rows: 30,
          cols: 30,
          initialState: this.generateRandomInitialState(30, 30),
        }),
      });

      const gameState: GameState = await response.json();
      this.renderGrid(gameState.grid);
    } catch (error) {
      console.error("Failed to initialize game:", error);
    }
  }

  private generateRandomInitialState(rows: number, cols: number): number[][] {
    return Array(rows)
      .fill(null)
      .map(() =>
        Array(cols)
          .fill(null)
          .map(() => (Math.random() > 0.7 ? 1 : 0))
      );
  }

  private renderGrid(grid: number[][]): void {
    this.gridElement.innerHTML = "";
    grid.forEach((row, i) => {
      const rowElement = document.createElement("div");
      rowElement.className = "row";

      row.forEach((cell, j) => {
        const cellElement = document.createElement("div");
        cellElement.className = `cell ${cell ? "alive" : ""}`;
        rowElement.appendChild(cellElement);
      });

      this.gridElement.appendChild(rowElement);
    });
  }

  private async nextGeneration(): Promise<void> {
    try {
      const response = await fetch(`${this.apiUrl}/game/next`, {
        method: "POST",
      });
      const gameState: GameState = await response.json();
      this.renderGrid(gameState.grid);
    } catch (error) {
      console.error("Failed to get next generation:", error);
    }
  }

  private startSimulation(): void {
    this.startButton.disabled = true;
    this.stopButton.disabled = false;
    this.intervalId = window.setInterval(() => this.nextGeneration(), 500);
  }

  private stopSimulation(): void {
    if (this.intervalId !== null) {
      window.clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.startButton.disabled = false;
    this.stopButton.disabled = true;
  }
}

// Initialize the application
window.addEventListener("DOMContentLoaded", () => {
  new GameOfLifeGUI();
});
