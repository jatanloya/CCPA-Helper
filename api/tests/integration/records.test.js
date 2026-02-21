const request = require("supertest");
const app = require("../../app");
const { record: Record } = require("../../models/record");

const sampleRecord = {
  company: "Twitter",
  mainURL: "https://twitter.com/",
  dateOfPolicy: "2024-01-15",
  policyURL: "https://twitter.com/en/privacy",
  CCPA: true,
  clicks: 2,
  rtk: {
    exists: true,
    mechanism: "Form",
    url: "https://help.twitter.com/en/forms/privacy",
  },
  rtd: {
    exists: true,
    mechanism: "Manual",
    url: "https://help.twitter.com/en/managing-your-account/how-to-deactivate-twitter-account",
  },
  rto: {
    exists: true,
    mechanism: "Manual",
    url: "https://optout.aboutads.info/",
    logo: true,
  },
};

describe("GET /api/health", () => {
  it("returns 200 with healthy status", async () => {
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe("healthy");
    expect(res.body.data.database).toBe("connected");
    expect(res.body.data.uptime).toBeGreaterThan(0);
  });
});

describe("POST /api/records", () => {
  it("creates a record and returns 201", async () => {
    const res = await request(app).post("/api/records").send(sampleRecord);
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.company).toBe("Twitter");
    expect(res.body.data.id).toBeDefined();
    expect(res.body.data.rtk.exists).toBe(true);
  });

  it("returns 400 for missing required fields", async () => {
    const res = await request(app)
      .post("/api/records")
      .send({ company: "Test" });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("returns 400 for invalid URL", async () => {
    const res = await request(app)
      .post("/api/records")
      .send({ ...sampleRecord, mainURL: "not-a-url" });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("returns 409 for duplicate mainURL", async () => {
    await request(app).post("/api/records").send(sampleRecord);
    const res = await request(app).post("/api/records").send(sampleRecord);
    expect(res.status).toBe(409);
    expect(res.body.error).toMatch(/Duplicate/i);
  });
});

describe("GET /api/records", () => {
  beforeEach(async () => {
    await Record.create([
      { ...sampleRecord, company: "Alpha", mainURL: "https://alpha.com/" },
      { ...sampleRecord, company: "Beta", mainURL: "https://beta.com/" },
      { ...sampleRecord, company: "Gamma", mainURL: "https://gamma.com/" },
    ]);
  });

  it("returns paginated results", async () => {
    const res = await request(app).get("/api/records?page=1&limit=2");
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(2);
    expect(res.body.pagination.total).toBe(3);
    expect(res.body.pagination.pages).toBe(2);
  });

  it("filters by company name", async () => {
    const res = await request(app).get("/api/records?company=Alpha");
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].company).toBe("Alpha");
  });

  it("filters by url", async () => {
    const res = await request(app).get(
      "/api/records?url=https://beta.com/"
    );
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].company).toBe("Beta");
  });
});

describe("GET /api/records/:id", () => {
  it("returns a record by id", async () => {
    const doc = await Record.create(sampleRecord);
    const res = await request(app).get(`/api/records/${doc._id}`);
    expect(res.status).toBe(200);
    expect(res.body.data.company).toBe("Twitter");
  });

  it("returns 404 for non-existent id", async () => {
    const fakeId = "aaaaaaaaaaaaaaaaaaaaaaaa";
    const res = await request(app).get(`/api/records/${fakeId}`);
    expect(res.status).toBe(404);
    expect(res.body.error).toMatch(/not found/i);
  });

  it("returns 400 for invalid id format", async () => {
    const res = await request(app).get("/api/records/invalid-id");
    expect(res.status).toBe(400);
  });
});

describe("PUT /api/records/:id", () => {
  it("updates a record", async () => {
    const doc = await Record.create(sampleRecord);
    const res = await request(app)
      .put(`/api/records/${doc._id}`)
      .send({ company: "X Corp" });
    expect(res.status).toBe(200);
    expect(res.body.data.company).toBe("X Corp");
  });

  it("returns 404 for non-existent id", async () => {
    const fakeId = "aaaaaaaaaaaaaaaaaaaaaaaa";
    const res = await request(app)
      .put(`/api/records/${fakeId}`)
      .send({ company: "Test" });
    expect(res.status).toBe(404);
  });
});

describe("DELETE /api/records/:id", () => {
  it("deletes a record and returns 204", async () => {
    const doc = await Record.create(sampleRecord);
    const res = await request(app).delete(`/api/records/${doc._id}`);
    expect(res.status).toBe(204);

    const found = await Record.findById(doc._id);
    expect(found).toBeNull();
  });

  it("returns 404 for non-existent id", async () => {
    const fakeId = "aaaaaaaaaaaaaaaaaaaaaaaa";
    const res = await request(app).delete(`/api/records/${fakeId}`);
    expect(res.status).toBe(404);
  });
});

describe("GET /api/records/search", () => {
  beforeEach(async () => {
    await Record.create([
      { ...sampleRecord, company: "Google", mainURL: "https://google.com/" },
      {
        ...sampleRecord,
        company: "Facebook",
        mainURL: "https://facebook.com/",
      },
    ]);
  });

  it("returns results matching text query", async () => {
    const res = await request(app).get("/api/records/search?q=Google");
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThanOrEqual(1);
    expect(res.body.data[0].company).toBe("Google");
  });

  it("returns 400 when q is missing", async () => {
    const res = await request(app).get("/api/records/search");
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/required/i);
  });
});

describe("GET /api/data (backward compat)", () => {
  it("returns a single record by URL", async () => {
    await Record.create(sampleRecord);
    const res = await request(app).get(
      "/api/data?url=https://twitter.com/"
    );
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].company).toBe("Twitter");
  });
});
