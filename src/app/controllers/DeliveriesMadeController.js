import * as Yup from 'yup';
import { Op } from 'sequelize';
import { subHours } from 'date-fns';
import Order from '../models/Order';
import Recipient from '../models/Recipient';
import Address from '../models/Address';
import Deliveryman from '../models/Deliveryman';
import File from '../models/File';

class DeliveriesMadeController {
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
        end_date: {
          [Op.ne]: null,
        },
      },
      attributes: ['id', 'product'],
      include: [
        {
          model: Recipient,
          as: 'recipient',
          attributes: ['id', 'name'],
          include: [
            {
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
          ],
        },
      ],
    });

    return res.json(orders);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      signature_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Validation Fail' });
    }

    const { id, order_id } = req.params;
    const { signature_id } = req.body;

    const deliverymanExists = await Deliveryman.findByPk(id);
    const signatureExists = await File.findByPk(signature_id);

    if (!deliverymanExists) {
      return res.status(401).json({ error: 'Deliveryman does not exists' });
    }

    if (!signatureExists) {
      return res.status(401).json({ error: 'Signature file does not exists' });
    }

    const orderExists = await Order.findOne({
      where: {
        id: order_id,
        deliveryman_id: id,
      },
    });

    if (!orderExists) {
      return res
        .status(401)
        .json({ error: 'Order does not exist or was not directed at you' });
    }

    if (orderExists.start_date === null) {
      return res.status(401).json({ error: 'Delivery has not started' });
    }

    orderExists.signature_id = signature_id;
    orderExists.end_date = subHours(new Date(), 3);

    orderExists.save();

    return res.json({
      id,
      order_id,
      signature_id,
    });
  }
}

export default new DeliveriesMadeController();
