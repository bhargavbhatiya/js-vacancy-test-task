import { routeUtil } from 'utils';

import list from './actions/list';
import update from './actions/update';
import remove from './actions/remove';
import create from './actions/create';
import createCheckoutSession from './actions/create-checkout-session';
import uploadProductPhoto from './actions/upload-product-photo';

const publicRoutes = routeUtil.getRoutes([]);

const privateRoutes = routeUtil.getRoutes([
  uploadProductPhoto,
  list,
  update,
  remove,
  create,
  createCheckoutSession,
]);

const adminRoutes = routeUtil.getRoutes([
  uploadProductPhoto,
  list,
  update,
  remove,
  create,
  createCheckoutSession,
]);

export default {
  publicRoutes,
  privateRoutes,
  adminRoutes,
};
