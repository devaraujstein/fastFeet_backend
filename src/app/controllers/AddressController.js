import * as Yup from 'yup';

import Address from '../models/Address';

class AddressController {
  async store(req, res) {
    const schema = Yup.object().shape({
      street: Yup.string().required(),
      number: Yup.integer().required(),
      complement: Yup.string(),
      state: Yup.string().required(),
      city: Yup.string().required(),
      zipCode: Yup.string().required(),
      recipientId: Yup.integer().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Validation Fail' });
    }

    const {
      id,
      recipientId,
      street,
      number,
      state,
      city,
      zipCode,
    } = await Address.create(req.body);

    return res.status(201).json({
      id,
      recipientId,
      street,
      number,
      state,
      city,
      zipCode,
    });
  }
}

export default new AddressController();
