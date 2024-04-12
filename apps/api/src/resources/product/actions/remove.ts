import { AppKoaContext, AppRouter, Next } from 'types';

import { productService } from 'resources/product';

type ValidatedData = never;
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
  await productService.deleteSoft({ _id: ctx.request.params.id });

  ctx.body = {};
}

export default (router: AppRouter) => {
  router.delete('/:id', validator, handler);
};
