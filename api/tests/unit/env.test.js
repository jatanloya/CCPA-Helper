const { validateEnv } = require("../../config/env");

describe("validateEnv", () => {
  let originalEnv;

  beforeEach(() => {
    originalEnv = { ...process.env };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("throws if MONGO_URI is missing", () => {
    delete process.env.MONGO_URI;
    expect(() => validateEnv()).toThrow("Missing required environment variables: MONGO_URI");
  });

  it("does not throw when all required vars are set", () => {
    process.env.MONGO_URI = "mongodb://localhost:27017/test";
    expect(() => validateEnv()).not.toThrow();
  });
});
