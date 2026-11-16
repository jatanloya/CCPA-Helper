const { ZodError } = require("zod");

function validate(schema, source = "body") {
  return (req, _res, next) => {
    try {
      const parsed = schema.parse(req[source]);
      // Express 5 exposes req.query as a getter, so plain assignment is
      // silently ignored. Redefine the property to hold the parsed value.
      Object.defineProperty(req, source, {
        value: parsed,
        writable: true,
        configurable: true,
        enumerable: true,
      });
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        err.statusCode = 400;
      }
      next(err);
    }
  };
}

module.exports = validate;
