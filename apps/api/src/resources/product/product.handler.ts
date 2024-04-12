import { eventBus, InMemoryEvent } from '@paralect/node-mongo';

import { Product } from 'types';
import { DATABASE_DOCUMENTS } from 'app-constants';

import logger from 'logger';
import ioEmitter from 'io-emitter';

const { PRODUCTS } = DATABASE_DOCUMENTS;

eventBus.on(`${PRODUCTS}.updated`, (data: InMemoryEvent<Product>) => {
  try {
    const product = data.doc;

    ioEmitter.publishToProduct(product._id, 'product:updated', product);
  } catch (err) {
    logger.error(`${PRODUCTS}.updated handler error: ${err}`);
  }
});
