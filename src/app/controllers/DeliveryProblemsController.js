import * as Yup from 'yup';

import DeliveryProblems from '../models/DeliveryProblems';
import Order from '../models/Order';
import Deliveryman from '../models/Deliveryman';

class DeliveryProblemsController {
  async index(req, res) {
    const { id } = req.params;

    const orderExists = await Order.findByPk(id);

    if (!orderExists) {
      return res.status(401).json({ error: 'Order does not exists' });
    }

    const deliveryProblems = await DeliveryProblems.findAll({
      where: {
        order_id: id,
      },
      include: {
        model: Order,
        as: 'orders',
        include: {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['id', 'name', 'email'],
        },
        attributes: ['id', 'product'],
      },
      attributes: ['id', 'description'],
    });

    return res.json(deliveryProblems);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      description: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Validation Fail' });
    }

    const { id: order_id } = req.params;

    const orderExists = await Order.findByPk(order_id);

    if (!orderExists) {
      return res.status(401).json({ error: 'Order does not exists' });
    }

    const { description } = req.body;

    const deliveryProblem = await DeliveryProblems.create({
      order_id,
      description,
    });

    return res.json(deliveryProblem);
  }

  async delete(req, res) {
    const { id } = req.params;

    const deliveryProblemExists = await DeliveryProblems.findByPk(id);

    if (!deliveryProblemExists) {
      return res.json({ error: 'Delivery Problems does not exists' });
    }

    await deliveryProblemExists.destroy();

    return res.json({ id });
  }
}

export default new DeliveryProblemsController();
