import supertest from "supertest";
import app from "../../app";
import { readdir, unlink } from "fs";
import path from "path";

const request = supertest(app);

const IMAGE_DIR = "src/assets/thumbnail";

beforeAll(async () => {
  readdir(IMAGE_DIR, (err, files) => {
    if (err) throw err;

    for (const file of files) {
      unlink(path.join(IMAGE_DIR, file), (err) => {
        if (err) throw err;
      });
    }
  });
});

describe("Test route", () => {
  it("should response with status 200", async (done: DoneFn) => {
    const response = await request.get("/api");
    expect(response.statusCode).toBe(200);
    done();
  });

  it("should response Api is running", () => async (done: DoneFn) => {
    const response = await request.get("/api");
    expect(response.body).toBe("Api is running");
    done();
  });
});

describe("GET /routes/images", () => {
  it("should response image not missing filename", async (done: DoneFn) => {
    const response = await request.get("/api/image");
    expect(response.statusCode).toBe(400);
    expect(response.text).toBe("Filename missing");
    done();
  });

  it("it should response original image", async (done: DoneFn) => {
    const response = await request.get("/api/image?filename=palmtunnel");
    expect(response.statusCode).toBe(200);
    done();
  });

  it("it should response an thumbnail", async (done: DoneFn) => {
    const response = await request.get(
      "/api/image?filename=palmtunnel&width=200&height=200"
    );
    expect(response.statusCode).toBe(200);
    done();
  });
});
