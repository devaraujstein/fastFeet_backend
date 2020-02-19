import { Router } from 'express';

import authMiddleware from './app/middlewares/auth';
import authAdminMiddleware from './app/middlewares/authAdmin';

import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';
import AddressController from './app/controllers/AddressController';
import UserController from './app/controllers/UserController';

const routes = new Router();

routes.post('/session', SessionController.store);

routes.get('/users', UserController.index);
routes.post('/users', UserController.store);

routes.use(authMiddleware);

routes.put('/users', UserController.update);

routes.use(authAdminMiddleware);

routes.get('/recipients', RecipientController.index);
routes.post('/recipients', RecipientController.store);
routes.put('/recipients/:id', RecipientController.update);

routes.get('/recipients/:recipient_id/addresses', AddressController.index);
routes.post('/recipients/:recipient_id/addresses', AddressController.store);
routes.put(
  '/recipients/:recipient_id/addresses/:address_id',
  AddressController.update
);

export default routes;
