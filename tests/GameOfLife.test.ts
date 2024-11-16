import { GameOfLife } from "../src/GameOfLife";

describe("GameOfLife", () => {
  let game: GameOfLife;

  beforeEach(() => {
    game = new GameOfLife(5, 5);
  });

  describe("initialization", () => {
    it("should create an empty grid of specified size", () => {
      const grid = game.getGrid();
      expect(grid.length).toBe(5);
      expect(grid[0].length).toBe(5);
      expect(grid.every((row) => row.every((cell) => cell === 0))).toBe(true);
    });
  });

  describe("cell manipulation", () => {
    it("should set and get cell values correctly", () => {
      game.setCell(1, 1, 1);
      expect(game.getCell(1, 1)).toBe(1);
    });

    it("should handle invalid positions gracefully", () => {
      game.setCell(-1, -1, 1);
      expect(game.getCell(-1, -1)).toBe(0);
      game.setCell(5, 5, 1);
      expect(game.getCell(5, 5)).toBe(0);
    });
  });

  describe("game rules", () => {
    it("should kill lonely cells", () => {
      game.setCell(1, 1, 1);
      game.nextGeneration();
      expect(game.getCell(1, 1)).toBe(0);
    });

    it("should kill overcrowded cells", () => {
      // Set up more than 3 neighbors
      game.setCell(1, 1, 1);
      game.setCell(0, 0, 1);
      game.setCell(0, 1, 1);
      game.setCell(0, 2, 1);
      game.setCell(1, 0, 1);
      game.nextGeneration();
      expect(game.getCell(1, 1)).toBe(0);
    });

    it("should keep cells alive with 2 or 3 neighbors", () => {
      // Set up 2 neighbors
      game.setCell(1, 1, 1);
      game.setCell(0, 1, 1);
      game.setCell(2, 1, 1);
      game.nextGeneration();
      expect(game.getCell(1, 1)).toBe(1);
    });

    it("should bring dead cells to life with exactly 3 neighbors", () => {
      game.setCell(0, 1, 1);
      game.setCell(1, 0, 1);
      game.setCell(1, 2, 1);
      game.nextGeneration();
      expect(game.getCell(1, 1)).toBe(1);
    });
  });

  describe("glider pattern", () => {
    it("should move the glider pattern correctly", () => {
      // Set up glider pattern
      game.setCell(1, 2, 1);
      game.setCell(2, 3, 1);
      game.setCell(3, 1, 1);
      game.setCell(3, 2, 1);
      game.setCell(3, 3, 1);

      const initialState = game.getGrid();
      game.nextGeneration();
      const nextState = game.getGrid();

      expect(nextState).not.toEqual(initialState);
    });
  });
});
