import { Router } from 'express';
import multer from 'multer';

import multerConfig from './config/multer';

import authMiddleware from './app/middlewares/auth';
import authAdminMiddleware from './app/middlewares/authAdmin';
import withdrawalsMiddleware from './app/middlewares/withdrawals';

import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';
import AddressController from './app/controllers/AddressController';
import UserController from './app/controllers/UserController';
import DeliverymanController from './app/controllers/DeliverymanController';
import OrderController from './app/controllers/OrderController';
import DeliveriesAvailableController from './app/controllers/DeliveriesAvailableController';
import DeliveriesMadeController from './app/controllers/DeliveriesMadeController';

import FileController from './app/controllers/FileController';

const routes = new Router();
const upload = multer(multerConfig);

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

routes.get('/deliveryman', DeliverymanController.index);
routes.post('/deliveryman', DeliverymanController.store);
routes.put('/deliveryman/:id', DeliverymanController.update);
routes.delete('/deliveryman/:id', DeliverymanController.delete);

routes.get('/deliveryman/:id/deliveries/', DeliveriesMadeController.index);

routes.get(
  '/deliveryman/:id/deliveries/available',
  DeliveriesAvailableController.index
);
routes.put(
  '/deliveryman/:id/deliveries/available',
  withdrawalsMiddleware,
  DeliveriesAvailableController.update
);

routes.get('/orders', OrderController.index);
routes.post('/orders', OrderController.store);
routes.put('/orders/:id', OrderController.update);
routes.delete('/orders/:id', OrderController.delete);

routes.post('/files', upload.single('file'), FileController.store);

export default routes;
