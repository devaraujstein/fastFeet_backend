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
}

export default new DeliveriesAvailableController();
