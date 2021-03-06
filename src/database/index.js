import Sequelize from 'sequelize';

import databaseConfig from '../config/database';

import User from '../app/models/User';
import Recipient from '../app/models/Recipient';
import Address from '../app/models/Address';
import Deliveryman from '../app/models/Deliveryman';
import File from '../app/models/File';
import Order from '../app/models/Order';
import DeliveryProblem from '../app/models/DeliveryProblems';

const models = [
  User,
  Recipient,
  Address,
  Deliveryman,
  File,
  Order,
  DeliveryProblem,
];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);
    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }
}

export default new Database();
