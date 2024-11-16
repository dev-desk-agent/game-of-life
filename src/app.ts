import express, { Express, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import { GameOfLife } from "./GameOfLife";
import { InitializeGameRequest, GameState } from "./types";

export class App {
  public app: Express;
  private port: number;
  private gameInstance: GameOfLife | null = null;

  constructor(port: number) {
    this.app = express();
    this.port = port;
    this.initializeMiddlewares();
    this.initializeRoutes();
  }

  private initializeMiddlewares(): void {
    this.app.use(express.json());
    this.app.use(cors());
    this.app.use(helmet());
  }

  private initializeRoutes(): void {
    // Initialize game
    this.app.post(
      "/game",
      (req: Request<{}, {}, InitializeGameRequest>, res: Response) => {
        const { rows, cols, initialState } = req.body;

        if (!rows || !cols || rows < 1 || cols < 1) {
          return res.status(400).json({ error: "Invalid dimensions" });
        }

        this.gameInstance = new GameOfLife(rows, cols);

        if (initialState) {
          for (let i = 0; i < Math.min(rows, initialState.length); i++) {
            for (let j = 0; j < Math.min(cols, initialState[i].length); j++) {
              this.gameInstance.setCell(i, j, initialState[i][j]);
            }
          }
        }

        const gameState: GameState = {
          grid: this.gameInstance.getGrid(),
          rows,
          cols,
        };

        res.json(gameState);
      }
    );

    // Get current state
    this.app.get("/game", (req: Request, res: Response) => {
      if (!this.gameInstance) {
        return res.status(404).json({ error: "Game not initialized" });
      }

      const gameState: GameState = {
        grid: this.gameInstance.getGrid(),
        rows: this.gameInstance["rows"],
        cols: this.gameInstance["cols"],
      };

      res.json(gameState);
    });

    // Generate next state
    this.app.post("/game/next", (req: Request, res: Response) => {
      if (!this.gameInstance) {
        return res.status(404).json({ error: "Game not initialized" });
      }

      this.gameInstance.nextGeneration();

      const gameState: GameState = {
        grid: this.gameInstance.getGrid(),
        rows: this.gameInstance["rows"],
        cols: this.gameInstance["cols"],
      };

      res.json(gameState);
    });
  }

  public listen(): void {
    this.app.listen(this.port, () => {
      console.log(`Server is running on port ${this.port}`);
    });
  }
}

if (require.main === module) {
  const app = new App(3000);
  app.listen();
}

export default App;
