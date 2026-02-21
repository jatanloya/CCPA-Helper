const { ZodError } = require("zod");

function validate(schema, source = "body") {
  return (req, _res, next) => {
    try {
      req[source] = schema.parse(req[source]);
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
