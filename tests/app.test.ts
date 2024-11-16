import request from "supertest";
import { App } from "../src/app";

describe("App", () => {
  let app: App;

  beforeAll(() => {
    app = new App(3000);
  });

  describe("GET /", () => {
    it("should return 200 and hello message", async () => {
      const response = await request(app.app)
        .get("/")
        .expect("Content-Type", /text/)
        .expect(200);

      expect(response.text).toBe("Hello, TypeScript Node.js!");
    });
  });
});
