import * as Yup from 'yup';

import Recipient from '../models/Recipient';
import Deliveryman from '../models/Deliveryman';
import Order from '../models/Order';
import Address from '../models/Address';

import productoutMail from '../jobs/ProductoutMail';
import queue from '../../lib/Queue';

class OrderController {
  async index(req, res) {
    const order = await Order.findAll({
      include: [
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: Recipient,
          as: 'recipient',
          attributes: ['name'],
          include: {
            model: Address,
            as: 'addresses',
            attributes: [
              'street',
              'number',
              'complement',
              'state',
              'city',
              'zip_code',
            ],
          },
        },
      ],
      attributes: ['id', 'product'],
    });

    return res.json(order);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      recipient_id: Yup.number().required(),
      deliveryman_id: Yup.number().required(),
      product: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Validation Fail' });
    }

    const { recipient_id, deliveryman_id, product } = req.body;

    const recipientExists = await Recipient.findByPk(recipient_id);
    const deliverymanExists = await Deliveryman.findByPk(deliveryman_id, {
      attributes: ['id', 'name', 'email'],
    });

    if (!recipientExists) {
      return res.status(401).json({ error: 'Recipient does not exists' });
    }

    if (!deliverymanExists) {
      return res.status(401).json({ error: 'Deliveryman does not exists' });
    }

    const order = await Order.create({
      recipient_id,
      deliveryman_id,
      product,
    });

    /**
     * Send email to deliveryman, product available to out
     */

    const data = {
      name: deliverymanExists.name,
      email: deliverymanExists.email,
      product,
    };

    await queue.add(productoutMail.key, data);

    return res.json(order);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      recipient_id: Yup.number().required(),
      deliveryman_id: Yup.number().required(),
      product: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Validation Fail' });
    }

    const orderExists = await Order.findByPk(req.params.id);

    if (!orderExists) {
      return res.status(401).json({ error: 'Order does not exists' });
    }

    const { recipient_id, deliveryman_id, product } = req.body;

    const recipientExists = await Recipient.findByPk(recipient_id);
    const deliverymanExists = await Deliveryman.findByPk(deliveryman_id);

    if (!recipientExists) {
      return res.status(401).json({ error: 'Recipient does not Exists' });
    }

    if (!deliverymanExists) {
      return res.status(401).json({ error: 'Deliveryman does not Exists' });
    }

    await Order.update(
      {
        recipient_id,
        deliveryman_id,
        product,
      },
      {
        where: { id: req.params.id },
      }
    );

    return res.json({
      recipient_id,
      deliveryman_id,
      product,
    });
  }

  async delete(req, res) {
    const { id } = req.params;

    const order = await Order.findByPk(id);

    const { product } = order;

    if (!order) {
      return res.status(401).json({ error: 'Order does not exists' });
    }

    await order.destroy();

    return res.json({
      id,
      product,
    });
  }
}

export default new OrderController();
