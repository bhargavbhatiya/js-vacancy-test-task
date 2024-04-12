import { z } from 'zod';
import { AppKoaContext, AppRouter } from 'types';
import { productService } from 'resources/product';
import { validateMiddleware } from 'middlewares';

const schema = z.object({
  page: z.string().transform(Number).default('1'),
  perPage: z.string().transform(Number).default('10'),
  sort: z
    .object({
      createdOn: z.enum(['asc', 'desc']),
    })
    .default({ createdOn: 'desc' }),
  createdBy: z.string().nullable().default(null),
  filter: z
    .object({
      createdOn: z
        .object({
          sinceDate: z.string(),
          dueDate: z.string(),
        })
        .nullable()
        .default(null),
      price: z
        .object({
          from: z.union([z.number(), z.string()]),
          to: z.union([z.number(), z.string()]),
        })
        .nullable()
        .default(null),
    })
    .nullable()
    .default(null),
  searchValue: z.string().default(''),
});

type ValidatedData = z.infer<typeof schema>;

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { perPage, page, sort, searchValue, filter, createdBy } =
    ctx.validatedData;

  const validatedSearch = searchValue
    .split('\\')
    .join('\\\\')
    .split('.')
    .join('\\.');
  const regExp = new RegExp(validatedSearch, 'gi');

  let priceFilter = {};
  if (filter?.price) {
    const fromPrice = parseFloat(filter.price.from as string);
    const toPrice = parseFloat(filter.price.to as string);

    priceFilter = {
      price: {
        $gte: fromPrice,
        $lte: toPrice,
      },
    };
  }

  const products = await productService.find(
    {
      $and: [
        {
          $or: [{ name: { $regex: regExp } }, { createdOn: {} }],
        },
        filter?.createdOn
          ? {
            createdOn: {
              $gte: new Date(filter.createdOn.sinceDate as string),
              $lt: new Date(filter.createdOn.dueDate as string),
            },
          }
          : {},
        createdBy ? { createdBy } : {},
        priceFilter,
      ],
    },
    { page, perPage },
    { sort },
  );

  ctx.body = {
    items: products.results,
    totalPages: products.pagesCount,
    count: products.count,
  };
}

export default (router: AppRouter) => {
  router.get('/', validateMiddleware(schema), handler);
};
