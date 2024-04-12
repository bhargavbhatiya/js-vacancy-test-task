///create-checkout-session endpoint
import stripe from 'services/stripe/stripe.service';
import validateMiddleware from 'middlewares/validateCart.middleware';

import { AppKoaContext, AppRouter, Next } from 'types';

// import { Product } from "types";

import { z } from 'zod';

interface Product {
  name: string;
  price: string;
  image: string;
  cartQuantity: string;
}
const schema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  price: z.string().min(1, 'Price is required').max(1000000),
  image: z.string().nullable().optional(),
  cartQuantity: z.string().min(1, 'Quantity is required').max(1000),
});

interface ValidatedData extends z.infer<typeof schema> {
  product: Product;
}

async function validator(ctx: AppKoaContext<ValidatedData>, next: Next) {
  // const { name } = ctx.validatedData;
  console.log('product', ctx.validatedData);

  await next();
}
async function handler(ctx: AppKoaContext<ValidatedData>) {
  const products = ctx.validatedData as unknown as Product[];

  const lineItems = products.map((product) => ({
    price_data: {
      currency: 'usd',
      product_data: {
        name: product.name ?? '',
        images: product.image ? [product.image] : [],
      },
      unit_amount: parseFloat(product.price) * 100, // Convert price to cents
    },
    quantity: parseInt(product.cartQuantity),
  }));

  // Create Stripe checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: lineItems,
    // line_items: [
    //   {
    //     price_data: {
    //       currency: "usd",
    //       product_data: {
    //         name: "a product",
    //         images: ["https://example.com/t-shirt.png"],
    //       },
    //       unit_amount: parseInt("3") * 100, // Convert price to cents
    //     },
    //     quantity: 2,
    //   },
    // ],
    mode: 'payment',
    success_url: '{process.env.WEB_URL}/payment/successful', // "http://localhost:3002/payment/successful
    cancel_url: '{process.env.WEB_URL}/payment/failed',
  });

  console.log('session', session);
  ctx.body = session.url ?? 'HIIIII';
  // Redirect user to Stripe checkout page
  //   ctx.redirect(session.url ?? "hoooo");

  // const parsedPrice = parseInt(price);
  // const parsedQuantity = parseInt(quantity);

  // ctx.body = await stripe.checkout.sessions.create({
  //   payment_method_types: ["card"],
  //   line_items: [
  //     {
  //       price_data: {
  //         currency: "usd",
  //         product_data: {
  //           name,
  //           images: [image],
  //         },
  //         unit_amount: parsedPrice,
  //       },
  //       quantity: parsedQuantity,
  //     },
  //   ],
  //   mode: "payment",
  //   success_url: "http://${req.headers.origin}/payment/successful",
  //   cancel_url: "https://${req.headers.origin}/payment/failed",
  // });
}

export default (router: AppRouter) => {
  router.post(
    '/create-checkout-session',
    validateMiddleware(schema),
    validator,
    handler,
  );
};
