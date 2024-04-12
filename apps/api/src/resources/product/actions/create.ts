// code to create a product
import { z } from 'zod';
import { AppKoaContext, AppRouter, Next, Product } from 'types';

import { productService } from 'resources/product';
import stripe from 'services/stripe/stripe.service';
import validateMiddleware from 'middlewares/validate.middleware';
import analyticsService from 'services/analytics/analytics.service';

const schema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  price: z.string().min(1, 'Price is required').max(1000000),
  image: z.string().nullable().optional(),
  quantity: z.string().min(1, 'Quantity is required').max(1000),
  createdBy: z.string().min(1, 'Please enter Created By'),
});

interface ValidatedData extends z.infer<typeof schema> {
  product: Product;
}

async function validator(ctx: AppKoaContext<ValidatedData>, next: Next) {
  const { name } = ctx.validatedData;

  const isProductExists = await productService.exists({ name });

  ctx.assertClientError(!isProductExists, {
    productId: 'Product with this name is already registered',
  });

  await next();
}

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { name, price, image, createdBy, quantity } = ctx.validatedData;

  console.log('Creating product', {
    name,
    price,
    image,
    createdBy,
    quantity,
  });

  //stripe product
  const stripeProduct = await stripe.products.create({
    name,
  });

  const product = await productService.insertOne({
    name,
    price,
    image,
    quantity,
    createdBy,
    stripeProductId: stripeProduct.id,
  });

  console.log('Product created', product);

  ctx.body = { product };
}

export default (router: AppRouter) => {
  router.post('/', validateMiddleware(schema), validator, handler);
};
