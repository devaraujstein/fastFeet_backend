import { Router } from 'express';

import RecipientController from './app/controllers/RecipientController';
import AddressController from './app/controllers/AddressController';

const routes = new Router();

routes.post('/recipients', RecipientController.store);
routes.post('/address', AddressController.store);

export default routes;
