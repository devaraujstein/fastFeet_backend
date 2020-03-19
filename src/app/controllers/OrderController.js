import * as Yup from 'yup';

import Recipient from '../models/Recipient';
import Deliveryman from '../models/Deliveryman';
import Order from '../models/Order';

import productoutMail from '../jobs/ProductoutMail';
import queue from '../../lib/Queue';

class OrderController {
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
}

export default new OrderController();
