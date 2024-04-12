import { z } from 'zod';

import { productSchema } from 'schemas';

export type Product = z.infer<typeof productSchema>;
