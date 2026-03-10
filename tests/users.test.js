const request = require("supertest");
const app = require("../src/index.js"); // adjust path if your express app is elsewhere

// ---------------------------------------------------------------
// These tests cover the full CRUD lifecycle for users.
// They run in order — the created user's ID is reused across tests.
// ---------------------------------------------------------------

let createdUserId;

// --- CREATE ---
describe("POST /users", () => {
  it("creates a new user with name and email", async () => {
    const res = await request(app)
      .post("/users")
      .send({ name: "Alice", email: "alice@example.com" });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.name).toBe("Alice");
    expect(res.body.email).toBe("alice@example.com");

    createdUserId = res.body.id; // save for later tests
  });

  it("returns 400 if name or email is missing", async () => {
    const res = await request(app)
      .post("/users")
      .send({ name: "NoEmail" });

    expect(res.statusCode).toBe(400);
  });
});

// --- READ ---
describe("GET /users", () => {
  it("returns a list of users", async () => {
    const res = await request(app).get("/users");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });
});

describe("GET /users/:id", () => {
  it("returns the correct user by ID", async () => {
    const res = await request(app).get(`/users/${createdUserId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(createdUserId);
    expect(res.body.name).toBe("Alice");
  });

  it("returns 404 for a non-existent user", async () => {
    const res = await request(app).get("/users/999999");

    expect(res.statusCode).toBe(404);
  });
});

// --- UPDATE ---
describe("PUT /users/:id", () => {
  it("updates the user's name and email", async () => {
    const res = await request(app)
      .put(`/users/${createdUserId}`)
      .send({ name: "Alice Updated", email: "alice.updated@example.com" });

    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe("Alice Updated");
    expect(res.body.email).toBe("alice.updated@example.com");
  });

  it("returns 404 when updating a non-existent user", async () => {
    const res = await request(app)
      .put("/users/999999")
      .send({ name: "Ghost" });

    expect(res.statusCode).toBe(404);
  });
});

// --- DELETE ---
describe("DELETE /users/:id", () => {
  it("deletes the user", async () => {
    const res = await request(app).delete(`/users/${createdUserId}`);

    expect(res.statusCode).toBe(200); // or 204 if you return no body
  });

  it("returns 404 when deleting an already-deleted user", async () => {
    const res = await request(app).delete(`/users/${createdUserId}`);

    expect(res.statusCode).toBe(404);
  });
});