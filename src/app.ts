import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";

export class App {
  public app: Express;
  private port: number;

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
    this.app.get("/", (req: Request, res: Response) => {
      res.send("Hello, TypeScript Node.js!");
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
