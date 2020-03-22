import * as Yup from 'yup';
import Order from '../models/Order';
import Recipient from '../models/Recipient';
import Address from '../models/Address';
import Deliveryman from '../models/Deliveryman';

class DeliveriesAvailableController {
  async index(req, res) {
    const { id } = req.params;

    const deliverymanExists = await Deliveryman.findByPk(id);

    if (!deliverymanExists) {
      return res.status(401).json({ error: 'Deliveryman does not exists' });
    }

    const orders = await Order.findAll({
      where: {
        deliveryman_id: id,
        canceled_at: null,
        end_date: null,
      },
      attributes: ['id', 'product'],
      include: {
        model: Recipient,
        as: 'recipient',
        attributes: ['id', 'name'],
        include: {
          model: Address,
          as: 'addresses',
          attributes: [
            'id',
            'street',
            'number',
            'complement',
            'state',
            'city',
            'zip_code',
          ],
        },
      },
    });

    return res.json(orders);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      order_id: Yup.number().required(),
      start_date: Yup.date().required(),
      end_date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Validation Fail' });
    }

    const { id } = req.params;

    const deliverymanExists = await Deliveryman.findByPk(id);

    if (!deliverymanExists) {
      return res.status(401).json({ error: 'Deliveryman does not exists' });
    }

    const { order_id } = req.body;

    const order = await Order.findOne({
      where: {
        id: order_id,
        deliveryman_id: id,
      },
    });

    if (!order) {
      return res
        .status(401)
        .json({ error: 'Order does not exist or was not directed at you' });
    }

    const { start_date, end_date } = req.body;

    order.start_date = start_date;
    order.end_date = end_date;

    await order.save();

    return res.json({
      order_id,
      start_date,
      end_date,
    });
  }
}

export default new DeliveriesAvailableController();
