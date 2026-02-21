const { z } = require("zod");

const rightSchema = z.object({
  exists: z.boolean(),
  mechanism: z.string().optional(),
  url: z.string().url().optional(),
  logo: z.boolean().optional(),
});

const createRecordSchema = z.object({
  company: z.string().min(1).max(200),
  mainURL: z.string().url(),
  dateOfPolicy: z.string().datetime().or(z.string().date()),
  policyURL: z.string().url().optional(),
  CCPA: z.boolean(),
  clicks: z.number().int().min(0).optional().default(0),
  rtk: rightSchema.optional(),
  rtd: rightSchema.optional(),
  rto: rightSchema.optional(),
});

const updateRecordSchema = createRecordSchema.partial();

const querySchema = z.object({
  url: z.string().optional(),
  company: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

module.exports = {
  createRecordSchema,
  updateRecordSchema,
  querySchema,
};
