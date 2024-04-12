import { ZodSchema, ZodError, ZodIssue } from 'zod';
import { AppKoaContext, Next, ValidationErrors } from 'types';

const formatError = (zodError: ZodError): ValidationErrors => {
  const errors: ValidationErrors = {};

  zodError.issues.forEach((error: ZodIssue) => {
    const key = error.path.join('.');

    if (!errors[key]) {
      errors[key] = [];
    }

    (errors[key] as string[]).push(error.message);
  });

  return errors;
};

const validate =
  (schema: ZodSchema) => async (ctx: AppKoaContext, next: Next) => {
    console.log('ctx.request.body', Array.isArray(ctx.request.body)); // true

    const products = Array.isArray(ctx.request.body)
      ? ctx.request.body
      : [ctx.request.body];

    for (const product of products) {
      const result = await schema.safeParseAsync(product);
      console.log('result', result);

      if (!result.success) {
        ctx.throw(400, { clientErrors: formatError(result.error) });
      }
    }
    ctx.validatedData = products;

    await next();
  };

export default validate;
