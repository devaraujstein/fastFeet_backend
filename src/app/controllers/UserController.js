import * as Yup from 'yup';

import User from '../models/User';

class UserController {
  async index(req, res) {
    const user = await User.findAll({
      attributes: ['id', 'name', 'email'],
    });

    return res.json(user);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .required()
        .min(6),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fail' });
    }

    const { email } = req.body;

    const user = await User.findOne({ where: { email } });

    if (user) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const { id, name } = await User.create(req.body);

    return res.status(201).json({
      id,
      name,
      email,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      old_password: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when('old_password', (old_password, field) =>
          old_password ? field.required() : field
        ),
      confirm_password: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fail' });
    }

    const { email, old_password } = req.body;

    const user = await User.findByPk(req.userId);

    if (email && email !== user.email) {
      return res.status(400).json({ error: 'Email does not Exists' });
    }

    if (old_password && !(await user.checkPassword(old_password))) {
      return res.status(400).json({ error: 'Password does not mach' });
    }

    const { id, name } = await user.update(req.body);

    return res.status(200).json({
      id,
      name,
      email,
    });
  }
}

export default new UserController();
