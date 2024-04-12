import multer from '@koa/multer';

import { Next, AppKoaContext, AppRouter } from 'types';

import cloudinaryStorageService from 'services/cloudinary-storage/cloudinary-storage.service';

const upload = multer();

async function validator(ctx: AppKoaContext, next: Next) {
  const { file } = ctx.request;
  ctx.assertClientError(file, { global: 'File cannot be empty' });

  await next();
}

async function handler(ctx: AppKoaContext) {
  const { file } = ctx.request;
  // console.log("handlerrrr", file);
  const fileName = `${Date.now()}-${file.originalname}`;

  let url;
  await cloudinaryStorageService
    .uploadPublic(`products/${fileName}`, file)
    .then((res: any) => {
      url = res.url;
    })
    .catch((err) => {
      url = '';
    });

  // console.log("url", url);
  ctx.body = { url };
}

export default (router: AppRouter) => {
  router.post('/product-photo', upload.single('file'), validator, handler);
};
