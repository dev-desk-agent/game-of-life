import request from "supertest";
import { App } from "../src/app";

describe("App", () => {
  let app: App;

  beforeEach(() => {
    app = new App(3000);
  });

  describe("Game of Life API", () => {
    it("should initialize game", async () => {
      const response = await request(app.app)
        .post("/game")
        .send({
          rows: 3,
          cols: 3,
          initialState: [
            [0, 1, 0],
            [0, 1, 0],
            [0, 1, 0],
          ],
        })
        .expect(200);

      expect(response.body).toHaveProperty("grid");
      expect(response.body.rows).toBe(3);
      expect(response.body.cols).toBe(3);
    });

    it("should return 404 when getting game state before initialization", async () => {
      await request(app.app).get("/game").expect(404);
    });

    it("should generate next generation", async () => {
      // Initialize game first
      await request(app.app)
        .post("/game")
        .send({
          rows: 3,
          cols: 3,
          initialState: [
            [0, 1, 0],
            [0, 1, 0],
            [0, 1, 0],
          ],
        });

      const response = await request(app.app).post("/game/next").expect(200);

      expect(response.body).toHaveProperty("grid");
    });
  });
});
