import { z } from 'zod';

import dbSchema from './db.schema';

export const productSchema = dbSchema
  .extend({
    name: z.string(),
    quantity: z.string(),
    price: z.string(),
    image: z.string().nullable().optional(),
    createdBy: z.string(),
    stripeProductId: z.string().nullable().optional(),
  })
  .strict();
