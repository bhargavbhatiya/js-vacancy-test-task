import { z } from 'zod';

import { AppKoaContext, AppRouter, Next } from 'types';

import { productService } from 'resources/product';

import { validateMiddleware } from 'middlewares';

const schema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  price: z.string().min(1, 'Price is required').max(1000000),
  image: z.string().nullable().optional(),
  quantity: z.string().min(1, 'Quantity is required').max(1000),
});

type ValidatedData = z.infer<typeof schema>;
type Request = {
  params: {
    id: string;
  };
};

async function validator(
  ctx: AppKoaContext<ValidatedData, Request>,
  next: Next,
) {
  const isProductExists = await productService.exists({
    _id: ctx.request.params.id,
  });

  ctx.assertError(isProductExists, 'Product not found');

  await next();
}

async function handler(ctx: AppKoaContext<ValidatedData, Request>) {
  const { name, price, image, quantity } = ctx.validatedData;

  const updatedProduct = await productService.updateOne(
    { _id: ctx.request.params?.id },
    () => ({ name, price, image, quantity }),
  );

  ctx.body = productService.getPublic(updatedProduct);
}

export default (router: AppRouter) => {
  router.put('/:id', validator, validateMiddleware(schema), handler);
};
