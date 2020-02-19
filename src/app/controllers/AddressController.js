import * as Yup from 'yup';

import Address from '../models/Address';
import Recipient from '../models/Recipient';

class AddressController {
  async index(req, res) {
    const { recipient_id } = req.params;

    const recipient = await Recipient.findByPk(recipient_id, {
      include: { association: 'addresses' },
    });

    return res.json(recipient);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      street: Yup.string().required(),
      number: Yup.number().required(),
      complement: Yup.string(),
      state: Yup.string().required(),
      city: Yup.string().required(),
      zip_code: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Validation Fail' });
    }

    const { recipient_id } = req.params;

    const recipient = await Recipient.findByPk(recipient_id);

    if (!recipient) {
      res.status(401).json({ error: 'Recipient not found' });
    }

    const { street, number, state, city, zip_code, complement } = req.body;

    const address = await Address.create({
      street,
      number,
      complement,
      state,
      city,
      zip_code,
      recipient_id,
    });

    return res.status(201).json(address);
  }
}

export default new AddressController();
