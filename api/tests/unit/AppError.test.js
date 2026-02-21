const AppError = require("../../utils/AppError");

describe("AppError", () => {
  it("creates an error with message and status code", () => {
    const err = new AppError("Not found", 404);
    expect(err.message).toBe("Not found");
    expect(err.statusCode).toBe(404);
    expect(err.name).toBe("AppError");
  });

  it("is an instance of Error", () => {
    const err = new AppError("Bad request", 400);
    expect(err).toBeInstanceOf(Error);
  });
});
